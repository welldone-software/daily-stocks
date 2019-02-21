import { ErrorHandler, Injectable } from '@angular/core';
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error) {
    console.warn('global error', error);
    alert(error.messge || 'Unknown error');
  }
}
