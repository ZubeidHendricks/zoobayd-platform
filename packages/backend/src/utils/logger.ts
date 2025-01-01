import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

class Logger {
  private static instance: winston.Logger;

  private constructor() {}

  public static getInstance(): winston.Logger {
    if (!Logger.instance) {
      const esTransportOpts = {
        level: 'info',
        clientOpts: {
          node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
        },
        indexPrefix: 'zoobayd-logs',
        transformer: (logData: any) => {
          const transformed = {
            '@timestamp': new Date().toISOString(),
            severity: logData.level,
            message: logData.message,
            serviceName: 'zoobayd-platform',
            metadata: logData.meta || {}
          };
          return transformed;
        }
      };

      Logger.instance = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
        defaultMeta: { service: 'zoobayd-platform' },
        transports: [
          // Console transport for local development
          new winston.transports.Console({
            format: winston.format.simple()
          }),
          // File transport for backup logging
          new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error' 
          }),
          new winston.transports.File({ 
            filename: 'logs/combined.log' 
          }),
          // Elasticsearch transport for centralized logging
          new ElasticsearchTransport(esTransportOpts)
        ]
      });
    }
    return Logger.instance;
  }

  // Static logging methods for easy access
  public static info(message: string, meta?: any) {
    this.getInstance().info(message, meta);
  }

  public static error(message: string, meta?: any) {
    this.getInstance().error(message, meta);
  }

  public static warn(message: string, meta?: any) {
    this.getInstance().warn(message, meta);
  }

  public static debug(message: string, meta?: any) {
    this.getInstance().debug(message, meta);
  }
}

export default Logger;