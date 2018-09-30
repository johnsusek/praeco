import { createLogger, ERROR, stdSerializers } from 'browser-bunyan';
import { ServerStream } from '@browser-bunyan/server-stream';
import store from '@/store';

let bunyan = null;

export function initLogging() {
  let options = {
    name: 'praeco',
    serializers: stdSerializers,
    src: true
  };

  if (store.state.config.config.errorLoggerUrl) {
    options.streams = [
      {
        level: ERROR,
        stream: new ServerStream({
          url: store.state.config.config.errorLoggerUrl,
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
