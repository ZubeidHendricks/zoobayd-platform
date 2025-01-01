#!/bin/bash

# System optimizations
sysctl -w vm.swappiness=10
sysctl -w vm.dirty_ratio=10
sysctl -w vm.dirty_background_ratio=5
echo never > /sys/kernel/mm/transparent_hugepage/enabled

# Mount NVMe instance storage
if [ -b /dev/nvme0n1 ]; then
    mkfs.xfs /dev/nvme0n1
    mkdir -p /mnt/ephemeral
    mount /dev/nvme0n1 /mnt/ephemeral
    echo "/dev/nvme0n1 /mnt/ephemeral xfs defaults,noatime 0 2" >> /etc/fstab
fi

# Install monitoring agents
curl -o /tmp/node_exporter.tar.gz -L https://github.com/prometheus/node_exporter/releases/download/v1.3.1/node_exporter-1.3.1.linux-amd64.tar.gz
tar -xvf /tmp/node_exporter.tar.gz -C /opt/
mv /opt/node_exporter-* /opt/node_exporter

# Create node_exporter service
cat > /etc/systemd/system/node_exporter.service << EOF
[Unit]
Description=Node Exporter
After=network.target

[Service]
Type=simple
User=root
ExecStart=/opt/node_exporter/node_exporter \
    --collector.diskstats \
    --collector.filesystem \
    --collector.loadavg \
    --collector.meminfo \
    --collector.netdev \
    --collector.cpu \
    --collector.vmstat
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable node_exporter
systemctl start node_exporter

# Configure custom metrics collection
mkdir -p /etc/custom-metrics
cat > /etc/custom-metrics/config.yaml << EOF
metrics:
  system:
    - name: node_iops
      command: "iostat -x | awk '/nvme0n1/{ print \$4 }'"
    - name: node_tcp_retrans
      command: "netstat -s | grep retransmitted | awk '{print \$1}'"
    - name: node_entropy_avail
      command: "cat /proc/sys/kernel/random/entropy_avail"
interval: 15
EOF

# Set up log rotation
cat > /etc/logrotate.d/kubernetes << EOF
/var/log/containers/*.log {
    rotate 7
    daily
    compress
    missingok
    notifempty
    delaycompress
    copytruncate
}
EOF