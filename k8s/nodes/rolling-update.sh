#!/bin/bash

MAX_UNAVAILABLE=1
CLUSTER_NAME="zoobayd-cluster"

function update_node() {
    local node=$1
    echo "Starting update for node: $node"
    
    kubectl drain $node --ignore-daemonsets --delete-emptydir-data
    
    # Update node instance
    OLD_INSTANCE=$(aws ec2 describe-instances --filters "Name=private-dns-name,Values=$node" --query "Reservations[].Instances[].InstanceId" --output text)
    AMI_ID=$(aws ec2 describe-launch-template-versions --launch-template-id $LAUNCH_TEMPLATE --versions '$Latest' --query "LaunchTemplateVersions[].LaunchTemplateData.ImageId" --output text)
    
    aws autoscaling start-instance-refresh \
        --auto-scaling-group-name $ASG_NAME \
        --preferences "MinHealthyPercentage=90,InstanceWarmup=300"
        
    # Wait for new node
    while true; do
        status=$(aws autoscaling describe-instance-refreshes \
            --auto-scaling-group-name $ASG_NAME \
            --query "InstanceRefreshes[0].Status" \
            --output text)
        if [ "$status" = "Successful" ]; then
            break
        fi
        sleep 30
    done
}

NODES=$(kubectl get nodes -l node-role.kubernetes.io/worker=true -o jsonpath='{.items[*].metadata.name}')
for node in $NODES; do
    update_node $node
    sleep 300  # Wait between nodes
done