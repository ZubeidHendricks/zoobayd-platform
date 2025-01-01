import Bull from 'bull';
import { redis } from '../config/redis';

export class QueueManager {
  private queues: Map<string, Bull.Queue>;

  constructor() {
    this.queues = new Map();
    this.initializeQueues();
  }

  private initializeQueues() {
    this.createQueue('ml-training', this.processMLTraining);
    this.createQueue('test-execution', this.processTestExecution);
    this.createQueue('usage-rollup', this.processUsageRollup);
  }

  private createQueue(name: string, processor: Bull.ProcessCallbackFunction<any>) {
    const queue = new Bull(name, {
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379')
      }
    });

    queue.process(processor);
    this.queues.set(name, queue);
  }

  async addJob(queueName: string, data: any, options?: Bull.JobOptions) {
    const queue = this.queues.get(queueName);
    if (!queue) throw new Error(`Queue ${queueName} not found`);
    return queue.add(data, options);
  }

  private async processMLTraining(job: Bull.Job) {
    // ML model training logic
  }

  private async processTestExecution(job: Bull.Job) {
    // A/B test execution logic
  }

  private async processUsageRollup(job: Bull.Job) {
    // Usage metrics aggregation logic
  }
}