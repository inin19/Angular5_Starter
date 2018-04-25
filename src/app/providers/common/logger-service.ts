import { Injectable } from '@angular/core';

export abstract class Logger {
  info: any;
  warn: any;
  error: any;
}

@Injectable()
export class LoggerService {
  info: any;
  warn: any;
  error: any;

  invokeConsoleMethod(type: string, args?: any): void { }
}
