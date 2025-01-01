import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import yaml from 'js-yaml';

interface ConfigOptions {
  environment: string;
  features: {
    [key: string]: boolean;
  };
  integrations: {
    [key: string]: string;
  };
}

class ConfigManager {
  private static instance: ConfigManager;
  private config: ConfigOptions;

  private constructor() {
    this.loadConfiguration();
  }

  // Singleton pattern
  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  // Load configuration from multiple sources
  private loadConfiguration() {
    // Load environment variables
    dotenv.config();

    // Load YAML configuration
    const configPath = path.resolve(__dirname, '../../config.yml');
    try {
      const fileContents = fs.readFileSync(configPath, 'utf8');
      const yamlConfig = yaml.load(fileContents) as ConfigOptions;
      
      this.config = {
        environment: process.env.NODE_ENV || yamlConfig.environment || 'development',
        features: {
          ...yamlConfig.features,
          ...(process.env.FEATURE_FLAGS ? 
            JSON.parse(process.env.FEATURE_FLAGS) : 
            {})
        },
        integrations: {
          ...yamlConfig.integrations,
          ...(process.env.INTEGRATIONS ? 
            JSON.parse(process.env.INTEGRATIONS) : 
            {})
        }
      };
    } catch (error) {
      console.error('Configuration load error:', error);
      this.config = {
        environment: process.env.NODE_ENV || 'development',
        features: {},
        integrations: {}
      };
    }
  }

  // Get entire configuration
  public getConfig(): ConfigOptions {
    return this.config;
  }

  // Get specific configuration value
  public get<T>(key: keyof ConfigOptions, defaultValue?: T): T {
    return this.config[key] as T || defaultValue;
  }

  // Check if a feature is enabled
  public isFeatureEnabled(feature: string): boolean {
    return this.config.features[feature] || false;
  }

  // Get integration configuration
  public getIntegration(name: string): string | undefined {
    return this.config.integrations[name];
  }

  // Reload configuration
  public reload() {
    this.loadConfiguration();
  }

  // Export configuration for frontend
  public exportPublicConfig() {
    return {
      environment: this.config.environment,
      features: Object.keys(this.config.features)
        .filter(feature => this.config.features[feature])
    };
  }
}

export default ConfigManager.getInstance();