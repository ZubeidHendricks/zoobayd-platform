#!/bin/bash

CLUSTER_NAME="zoobayd-cluster"
NAMESPACE="zoobayd"
MAX_UNAVAILABLE=1

function check_node_health() {
    local node=$1
    local conditions=$(kubectl get node $node -o json | jq '.status.conditions')
    
    echo "Checking health for node: $node"
    
    # Check Ready condition
    if [[ $(echo $conditions | jq '.[] | select(.type=="Ready").status') != '"True"' ]]; then
        return 1
    fi
    
    # Check memory pressure
    if [[ $(echo $conditions | jq '.[] | select(.type=="MemoryPressure").status') == '"True"' ]]; then
        return 1
    fi
    
    # Check disk pressure
    if [[ $(echo $conditions | jq '.[] | select(.type=="DiskPressure").status') == '"True"' ]]; then
        return 1
    fi
    
    return 0
}

function perform_maintenance() {
    local node=$1
    
    echo "Starting maintenance for node: $node"
    
    # Check if maintenance is allowed
    local unavailable=$(kubectl get nodes -l node-role.kubernetes.io/worker=true \
        -o jsonpath='{.items[?(@.spec.unschedulable)].metadata.name}' | wc -w)
    
    if [[ $unavailable -ge $MAX_UNAVAILABLE ]]; then
        echo "Too many nodes already under maintenance"
        return 1
    fi
    
    # Cordon the node
    kubectl cordon $node
    
    # Drain the node
    kubectl drain $node --ignore-daemonsets --delete-emptydir-data --force
    
    # Perform maintenance tasks
    echo "Running system updates..."
    ssh -o StrictHostKeyChecking=no ec2-user@$node "sudo yum update -y"
    
    echo "Cleaning docker storage..."
    ssh -o StrictHostKeyChecking=no ec2-user@$node "sudo docker system prune -af"
    
    echo "Rotating logs..."
    ssh -o StrictHostKeyChecking=no ec2-user@$node "sudo logrotate -f /etc/logrotate.conf"
    
    echo "Checking and repairing filesystem..."
    ssh -o StrictHostKeyChecking=no ec2-user@$node "sudo xfs_repair -L /dev/nvme0n1"
    
    # Uncordon the node
    kubectl uncordon $node
    
    echo "Maintenance completed for node: $node"
    return 0
}

# Main maintenance loop
while true; do
    NODES=$(kubectl get nodes -l node-role.kubernetes.io/worker=true -o jsonpath='{.items[*].metadata.name}')
    
    for node in $NODES; do
        if ! check_node_health $node; then
            echo "Node $node requires maintenance"
            perform_maintenance $node
            
            # Wait for node to be ready
            while ! check_node_health $node; do
                sleep 30
            done
        fi
    done
    
    sleep 3600  # Check every hour
done