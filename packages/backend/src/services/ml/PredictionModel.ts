import * as tf from '@tensorflow/tfjs-node';
import { FeatureUsage } from '../../types';

export class PredictionModel {
  private model: tf.Sequential;

  constructor() {
    this.model = this.buildModel();
  }

  private buildModel(): tf.Sequential {
    const model = tf.sequential();
    
    model.add(tf.layers.dense({
      units: 64,
      activation: 'relu',
      inputShape: [10]
    }));
    
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
    
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
    
    return model;
  }

  async train(features: FeatureUsage[], labels: number[]): Promise<void> {
    const tensorFeatures = tf.tensor2d(this.preprocessFeatures(features));
    const tensorLabels = tf.tensor2d(labels.map(l => [l]));
    
    await this.model.fit(tensorFeatures, tensorLabels, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs?.loss.toFixed(4)}`);
        }
      }
    });
  }

  async predict(features: FeatureUsage[]): Promise<number[]> {
    const tensorFeatures = tf.tensor2d(this.preprocessFeatures(features));
    const predictions = await this.model.predict(tensorFeatures) as tf.Tensor;
    return Array.from(await predictions.data());
  }

  private preprocessFeatures(features: FeatureUsage[]): number[][] {
    return features.map(f => [
      f.usageCount,
      f.duration,
      new Date(f.lastUsed).getTime()
    ]);
  }
}