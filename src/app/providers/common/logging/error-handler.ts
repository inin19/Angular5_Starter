import { Observable } from 'rxjs/Observable';
import { LoggerService } from '../logger-service';
import { of } from 'rxjs/observable/of';
import { Injector } from '@angular/core';

export class ErrorHandler {
  private logger: LoggerService;

  constructor(injector: Injector) {
    //    this.logger = injector.get(LoggerService);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      alert(error);
      this.logger.error(error);

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
