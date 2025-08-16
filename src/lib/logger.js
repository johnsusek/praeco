import { createLogger, ERROR, stdSerializers } from 'browser-bunyan';
import { ServerStream } from '@browser-bunyan/server-stream';

let bunyan = null;
let appStore = null;

export function initLogging(store) {
  appStore = store;
  
  let options = {
    name: 'praeco',
    serializers: stdSerializers,
    src: true
  };

  if (appStore && appStore.state.appconfig.config.errorLoggerUrl) {
    options.streams = [
      {
        level: ERROR,
        stream: new ServerStream({
          url: appStore.state.appconfig.config.errorLoggerUrl,
          method: 'PUT'
        })
      }
    ];
  }

  bunyan = createLogger(options);
}

export function logger() {
  return bunyan;
}
