import { createLogger, ERROR, stdSerializers } from 'browser-bunyan';
import { ServerStream } from '@browser-bunyan/server-stream';
// TODO:  error  Dependency cycle via ./configs:4  import/no-cycle
import store from '@/store';

let bunyan = null;

export function initLogging() {
  let options = {
    name: 'praeco',
    serializers: stdSerializers,
    src: true
  };

  if (store.state.appconfig.config.errorLoggerUrl) {
    options.streams = [
      {
        level: ERROR,
        stream: new ServerStream({
          url: store.state.appconfig.config.errorLoggerUrl,
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
