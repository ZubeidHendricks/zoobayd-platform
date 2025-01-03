import * as opentelemetry from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/node';
import { SimpleSpanProcessor } from '@opentelemetry/tracing';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import * as prometheus from 'prom-client';
import os from 'os';
import v8 from 'v8';

interface SystemMetrics {
    cpuUsage: number;
    memoryUsage: number;
    requestRate: number;
    errorRate: number;
    v8HeapStatistics: {
        totalHeapSize: number;
        usedHeapSize: number;
        heapSizeLimit: number;
    };
}

interface ServiceHealth {
    status: 'healthy' | 'degraded' | 'unhealthy';
    uptime: number;
    lastErrorTimestamp?: number;
    services: {
        [serviceName: string]: {
            status: 'up' | 'down';
            lastChecked: number;
        }
    };
}

interface TraceMetadata {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    serviceName: string;
    operationName: string;
    timestamp: number;
}

class MonitoringService {
    private tracerProvider: NodeTracerProvider;
    private tracer: opentelemetry.Tracer;
    private prometheusRegistry: prometheus.Registry;
    private serviceStartTime: number;
    private errorCounter: prometheus.Counter;
    private requestCounter: prometheus.Counter;

    constructor() {
        // Initialize service start time
        this.serviceStartTime = Date.now();

        // Initialize OpenTelemetry
        this.tracerProvider = new NodeTracerProvider();
        
        // Jaeger Exporter
        const jaegerExporter = new JaegerExporter({
            serviceName: 'zoobayd-platform',
            agentHost: 'localhost',
            agentPort: 6831
        });

        this.tracerProvider.addSpanProcessor(new SimpleSpanProcessor(jaegerExporter));
        this.tracerProvider.register();

        this.tracer = opentelemetry.trace.getTracer('zoobayd-platform-tracer');

        // Prometheus Metrics Registry
        this.prometheusRegistry = new prometheus.Registry();
        prometheus.collectDefaultMetrics({ 
            register: this.prometheusRegistry 
        });

        // Custom Prometheus Metrics
        this.errorCounter = new prometheus.Counter({
            name: 'zoobayd_errors_total',
            help: 'Total number of errors',
            labelNames: ['service', 'error_type']
        });

        this.requestCounter = new prometheus.Counter({
            name: 'zoobayd_requests_total',
            help: 'Total number of requests',
            labelNames: ['service', 'method']
        });

        this.prometheusRegistry.registerMetric(this.errorCounter);
        this.prometheusRegistry.registerMetric(this.requestCounter);
    }

    // Trace a specific operation
    startTrace(operationName: string, metadata?: Record<string, unknown>): opentelemetry.Span {
        const span = this.tracer.startSpan(operationName);
        
        if (metadata) {
            Object.entries(metadata).forEach(([key, value]) => {
                span.setAttribute(key, value);
            });
        }

        return span;
    }

    // Record system metrics
    async getSystemMetrics(): Promise<SystemMetrics> {
        const cpuUsage = os.cpus().map(cpu => cpu.times);
        const totalCpuUsage = cpuUsage.reduce((acc, curr) => {
            return acc + (curr.user + curr.nice + curr.sys) / 
                   (curr.user + curr.nice + curr.sys + curr.idle);
        }, 0) / cpuUsage.length;

        const memoryUsage = process.memoryUsage();
        const v8HeapStatistics = v8.getHeapStatistics();

        return {
            cpuUsage: totalCpuUsage * 100,
            memoryUsage: memoryUsage.heapUsed / memoryUsage.heapTotal * 100,
            requestRate: this.getRequestRate(),
            errorRate: this.getErrorRate(),
            v8HeapStatistics: {
                totalHeapSize: v8HeapStatistics.total_heap_size,
                usedHeapSize: v8HeapStatistics.used_heap_size,
                heapSizeLimit: v8HeapStatistics.heap_size_limit
            }
        };
    }

    // Get service health status
    async getServiceHealth(): Promise<ServiceHealth> {
        const uptime = Date.now() - this.serviceStartTime;

        return {
            status: this.determineServiceStatus(),
            uptime: uptime,
            services: {
                'contract-generator': { 
                    status: 'up', 
                    lastChecked: Date.now() 
                },
                'blockchain-integrator': { 
                    status: 'up', 
                    lastChecked: Date.now() 
                },
                'ml-optimizer': { 
                    status: 'up', 
                    lastChecked: Date.now() 
                }
            }
        };
    }

    // Record an error
    recordError(service: string, errorType: string) {
        this.errorCounter.inc({
            service,
            error_type: errorType
        });
    }

    // Record a request
    recordRequest(service: string, method: string) {
        this.requestCounter.inc({
            service,
            method
        });
    }

    // Get Prometheus metrics for scraping
    async getPrometheusMetrics(): Promise<string> {
        return this.prometheusRegistry.metrics();
    }

    // Determine overall service status
    private determineServiceStatus(): 'healthy' | 'degraded' | 'unhealthy' {
        const metrics = this.getSystemMetrics();

        if (metrics.cpuUsage > 90 || metrics.memoryUsage > 90) {
            return 'unhealthy';
        }

        if (metrics.cpuUsage > 70 || metrics.memoryUsage > 70) {
            return 'degraded';
        }

        return 'healthy';
    }

    // Calculate request rate
    private getRequestRate(): number {
        // This would typically track requests over a specific time window
        // Simplified implementation
        return 0; // Placeholder
    }

    // Calculate error rate
    private getErrorRate(): number {
        // This would typically track errors over a specific time window
        // Simplified implementation
        return 0; // Placeholder
    }

    // Create a distributed trace
    createDistributedTrace(
        traceName: string, 
        callback: (span: opentelemetry.Span) => Promise<void>
    ): Promise<void> {
        const span = this.tracer.startSpan(traceName);
        
        return callback(span)
            .then(() => {
                span.end();
            })
            .catch((error) => {
                span.recordException(error);
                span.setStatus({ code: opentelemetry.status.StatusCode.ERROR });
                span.end();
                throw error;
            });
    }
}

export default new MonitoringService();