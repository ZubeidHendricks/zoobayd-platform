import { trace } from '@opentelemetry/api';
import { Request, Response, NextFunction } from 'express';

const tracer = trace.getTracer('zoobayd-backend');

export const traceRequest = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const span = tracer.startSpan(`${req.method} ${req.path}`);
    
    span.setAttributes({
      'http.method': req.method,
      'http.url': req.url,
      'http.route': req.path,
      'user.id': req.user?.id,
      'team.id': req.user?.teamId
    });

    const originalEnd = res.end;
    res.end = function(...args) {
      span.setAttributes({
        'http.status_code': res.statusCode,
        'http.response_content_length': Number(res.get('content-length'))
      });
      span.end();
      originalEnd.apply(res, args);
    };

    next();
  };
};