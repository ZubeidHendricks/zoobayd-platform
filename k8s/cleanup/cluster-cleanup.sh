#!/bin/bash

NAMESPACE="zoobayd"
CLEANUP_THRESHOLD_HOURS=24
LOG_DIR="/var/log/cluster-cleanup"

# Setup logging
mkdir -p $LOG_DIR
exec 1> >(tee -a "$LOG_DIR/cleanup-$(date +%Y%m%d).log")
exec 2>&1

echo "Starting cluster cleanup - $(date)"

# Cleanup completed/failed pods
kubectl get pods --all-namespaces -o json | jq -r '
  .items[] | 
  select(.status.phase == ("Succeeded","Failed")) |
  [.metadata.namespace,.metadata.name] | 
  @tsv' |
while read namespace pod; do
  echo "Cleaning up pod $pod in namespace $namespace"
  kubectl delete pod $pod -n $namespace
done

# Remove unused persistent volumes
kubectl get pv -o json | jq -r '
  .items[] | 
  select(.status.phase == "Released") |
  .metadata.name' |
while read pv; do
  echo "Removing unused PV $pv"
  kubectl delete pv $pv
done

# Clean up old configmaps and secrets
for resource in configmap secret; do
  kubectl get $resource --all-namespaces -o json | jq -r '
    .items[] | 
    select(.metadata.creationTimestamp | fromdateiso8601 < now-'$((CLEANUP_THRESHOLD_HOURS*3600))') |
    [.metadata.namespace,.metadata.name] |
    @tsv' |
  while read namespace name; do
    echo "Cleaning up old $resource $name in namespace $namespace"
    kubectl delete $resource $name -n $namespace
  done
done

# Cleanup evicted pods
kubectl get pods --all-namespaces -o json | jq -r '
  .items[] | 
  select(.status.reason=="Evicted") |
  [.metadata.namespace,.metadata.name] |
  @tsv' |
while read namespace pod; do
  echo "Cleaning up evicted pod $pod in namespace $namespace"
  kubectl delete pod $pod -n $namespace
done

# Node cleanup
for node in $(kubectl get nodes -o name); do
  echo "Running cleanup on node $node"
  
  # Clean docker images
  kubectl debug node/$node -it --image=ubuntu -- chroot /host bash -c \
    "docker system prune -af --filter 'until=${CLEANUP_THRESHOLD_HOURS}h'"
    
  # Clean journald logs
  kubectl debug node/$node -it --image=ubuntu -- chroot /host bash -c \
    "journalctl --vacuum-time=${CLEANUP_THRESHOLD_HOURS}h"
done

# Report cluster status
echo "Cluster status after cleanup:"
kubectl get nodes
kubectl top nodes
df -h

echo "Cleanup completed - $(date)"