import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`[HTTP Request] ${req.method} ${req.urlWithParams}`);
  const startTime = Date.now();
  
  return next(req).pipe(
    tap({
      next: (event) => {
        const elapsed = Date.now() - startTime;
        console.log(`[HTTP Response] ${req.urlWithParams} took ${elapsed} ms`);
      },
      error: (error) => {
        const elapsed = Date.now() - startTime;
        console.error(`[HTTP Error] ${req.urlWithParams} failed after ${elapsed} ms`, error);
      }
    })
  );
};
