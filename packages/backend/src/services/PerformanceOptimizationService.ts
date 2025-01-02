import { Redis } from 'ioredis';
import { performance } from 'perf_hooks';

class PerformanceOptimizationService {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379')
    });
  }

  async cacheContractGeneration(
    cacheKey: string, 
    generationFunction: () => Promise<any>
  ) {
    const cachedResult = await this.redisClient.get(cacheKey);
    
    if (cachedResult) {
      return JSON.parse(cachedResult);
    }

    const startTime = performance.now();
    const result = await generationFunction();
    const executionTime = performance.now() - startTime;

    await this.redisClient.set(
      cacheKey, 
      JSON.stringify(result), 
      'EX', 
      3600 // 1-hour cache
    );

    return {
      result,
      executionTime
    };
  }

  async measurePerformance<T>(
    operation: () => Promise<T>
  ): Promise<{
    result: T;
    executionTime: number;
    memoryUsage: NodeJS.MemoryUsage;
  }> {
    const startTime = performance.now();
    const startMemory = process.memoryUsage();

    const result = await operation();

    const executionTime = performance.now() - startTime;
    const endMemory = process.memoryUsage();

    return {
      result,
      executionTime,
      memoryUsage: {
        rss: endMemory.rss - startMemory.rss,
        heapUsed: endMemory.heapUsed - startMemory.heapUsed
      }
    };
  }

  identifyPerformanceBottlenecks(
    operationMetrics: Array<{
      operation: string;
      executionTime: number;
      memoryUsage: number;
    }>
  ) {
    return operationMetrics
      .filter(metric => 
        metric.executionTime > 100 || // ms
        metric.memoryUsage > 50 * 1024 * 1024 // 50MB
      )
      .map(metric => ({
        operation: metric.operation,
        recommendation: this.generateOptimizationRecommendation(metric)
      }));
  }

  private generateOptimizationRecommendation(metric: {
    operation: string;
    executionTime: number;
    memoryUsage: number;
  }): string {
    if (metric.executionTime > 500) {
      return `High execution time detected for ${metric.operation}. Consider code refactoring or caching.`;
    }

    if (metric.memoryUsage > 100 * 1024 * 1024) {
      return `Excessive memory usage in ${metric.operation}. Optimize data structures and reduce memory allocations.`;
    }

    return 'No significant performance issues detected.';
  }
}

export default new PerformanceOptimizationService();