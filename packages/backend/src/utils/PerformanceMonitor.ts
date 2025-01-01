import * as os from 'os';
import v8 from 'v8';
import cluster from 'cluster';
import { performance } from 'perf_hooks';
import Logger from './Logger';

class PerformanceMonitor {
  private static memoryThreshold = 75; // Percentage
  private static cpuThreshold = 80; // Percentage

  // Monitor system resources
  public static monitorResources() {
    setInterval(() => {
      this.checkMemoryUsage();
      this.checkCPUUsage();
    }, 60000); // Check every minute
  }

  // Memory usage monitoring
  private static checkMemoryUsage() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemoryPercentage = ((totalMemory - freeMemory) / totalMemory) * 100;

    if (usedMemoryPercentage > this.memoryThreshold) {
      Logger.warn('High Memory Usage', {
        total: this.formatBytes(totalMemory),
        free: this.formatBytes(freeMemory),
        usedPercentage: usedMemoryPercentage.toFixed(2)
      });
    }
  }

  // CPU usage monitoring
  private static checkCPUUsage() {
    const cpus = os.cpus();
    const avgCpuUsage = cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
      const idle = cpu.times.idle;
      return acc + ((total - idle) / total) * 100;
    }, 0) / cpus.length;

    if (avgCpuUsage > this.cpuThreshold) {
      Logger.warn('High CPU Usage', {
        avgUsage: avgCpuUsage.toFixed(2),
        numCPUs: cpus.length
      });
    }
  }

  // Performance measurement decorator
  public static measurePerformance() {
    return function (
      target: any, 
      propertyKey: string, 
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: any[]) {
        const start = performance.now();
        try {
          const result = await originalMethod.apply(this, args);
          const duration = performance.now() - start;

          Logger.info('Method Performance', {
            method: propertyKey,
            duration: duration.toFixed(2),
            args: args.length
          });

          return result;
        } catch (error) {
          Logger.error('Performance Measurement Error', {
            method: propertyKey,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          throw error;
        }
      };

      return descriptor;
    };
  }

  // V8 Heap Statistics
  public static getHeapStats() {
    const heapStats = v8.getHeapStatistics();
    return {
      total: this.formatBytes(heapStats.total_heap_size),
      used: this.formatBytes(heapStats.used_heap_size),
      limit: this.formatBytes(heapStats.heap_size_limit)
    };
  }

  // Bytes formatter
  private static formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}

export default PerformanceMonitor;