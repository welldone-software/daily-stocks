import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class GlobalHttpInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.body && event.body['Error Message']) {
            console.warn(event.body);
            throw new Error('Api Error. Did you specify a valid symbol?');
          }
          // tslint:disable-next-line:no-string-literal
          if (event.body && event.body['Note']) {
            console.warn(event.body);
            throw new Error('Api limit reached. Please try again soon.');
          }
        }
        return event;
      }),
      catchError((error: HttpErrorResponse | Error) => {
        // const message =
        //   error instanceof Error
        //     ? error.message
        //     : error && error.error && error.error.reason;

        // // alert(message || 'Unknow error');

        return throwError(error instanceof Error ? error : error.error);
      })
    );
  }
}
