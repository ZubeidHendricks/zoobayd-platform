#!/bin/bash

CLUSTER_NAME="zoobayd-cluster"
COST_THRESHOLD=1000
LOG_DIR="/var/log/cost-optimization"

mkdir -p $LOG_DIR
exec 1> >(tee -a "$LOG_DIR/cost-reduction-$(date +%Y%m%d).log")
exec 2>&1

# Find and terminate idle instances
function optimize_instances() {
    local idle_nodes=$(kubectl top nodes | awk '$3 < 20 && $5 < 20 {print $1}')
    for node in $idle_nodes; do
        echo "Found idle node: $node"
        kubectl drain $node --ignore-daemonsets --delete-local-data
        aws autoscaling detach-instances --instance-ids $(aws ec2 describe-instances --filters "Name=private-dns-name,Values=$node" --query "Reservations[].Instances[].InstanceId" --output text) --auto-scaling-group-name $ASG_NAME --should-decrement-desired-capacity
    done
}

# Optimize EBS volumes
function optimize_volumes() {
    aws ec2 describe-volumes --filters "Name=tag:kubernetes.io/cluster/$CLUSTER_NAME,Values=owned" --query 'Volumes[*].[VolumeId,Size]' --output text | while read vol_id size; do
        usage=$(aws cloudwatch get-metric-statistics --namespace AWS/EBS --metric-name VolumeReadBytes --dimensions Name=VolumeId,Value=$vol_id --start-time $(date -d '7 days ago' --iso-8601=seconds) --end-time $(date --iso-8601=seconds) --period 3600 --statistics Average --query 'Datapoints[*].Average' --output text)
        if [ $(echo "$usage < 1000000" | bc) -eq 1 ]; then
            echo "Low usage volume found: $vol_id"
            aws ec2 create-snapshot --volume-id $vol_id --description "Backup before optimization"
            aws ec2 modify-volume --volume-id $vol_id --size $(($size/2))
        fi
    done
}

# Recommend Reserved Instances
function analyze_ri_recommendations() {
    aws ce get-reservation-purchase-recommendation \
        --service "Amazon Elastic Compute Cloud - Compute" \
        --look-back-period SIXTY_DAYS \
        --payment-option NO_UPFRONT \
        --term-in-years 1 \
        --query 'Recommendations[*].[InstanceDetails[0].Platform,RecommendedNumberOfInstancesToPurchase,EstimatedBreakEvenInMonths,EstimatedMonthlySavings]' \
        --output text
}

# Main execution
echo "Starting cost optimization - $(date)"

# Get current monthly cost
current_cost=$(aws ce get-cost-and-usage \
    --time-period Start=$(date -d "30 days ago" +%Y-%m-%d),End=$(date +%Y-%m-%d) \
    --granularity MONTHLY \
    --metrics BlendedCost \
    --query 'ResultsByTime[*].Total.BlendedCost.Amount' \
    --output text)

if (( $(echo "$current_cost > $COST_THRESHOLD" | bc -l) )); then
    echo "Cost threshold exceeded: $current_cost"
    optimize_instances
    optimize_volumes
    analyze_ri_recommendations
fi

# Report savings opportunities
aws ce get-cost-and-usage \
    --time-period Start=$(date -d "30 days ago" +%Y-%m-%d),End=$(date +%Y-%m-%d) \
    --granularity DAILY \
    --metrics USAGE_QUANTITY BLENDED_COST \
    --group-by Type=DIMENSION,Key=SERVICE \
    --filter '{"Dimensions": {"Key": "RECORD_TYPE","Values": ["Credit","Refund","Upfront","Support","Tax","Other","Usage"]}}'

echo "Cost optimization completed - $(date)"