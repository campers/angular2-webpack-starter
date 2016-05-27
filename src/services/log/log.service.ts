import {Injectable} from '@angular/core';
import log = core.log;

@Injectable()
export class Log {

  log(message?:any, ...optionalParams):void {
    console.log(message, ...optionalParams)
  }

  debug(message?:any, ...optionalParams):void {
    console.debug(message, ...optionalParams)
  }

  info(message?:any, ...optionalParams):void {
    console.info(message, ...optionalParams)
  }

  warn(message?:any, ...optionalParams):void {
    console.warn(message, ...optionalParams)
  }

  error(message?:any, ...optionalParams):void {
    console.error(message, ...optionalParams)
  }
}
