import { createLogger, ERROR, stdSerializers } from 'browser-bunyan';
import { ServerStream } from '@browser-bunyan/server-stream';
import { useAppConfigStore } from '@/stores';

let bunyan = null;

export function initLogging() {
  const appConfigStore = useAppConfigStore();
  
  let options = {
    name: 'praeco',
    serializers: stdSerializers,
    src: true
  };

  if (appConfigStore.config.errorLoggerUrl) {
    options.streams = [
      {
        level: ERROR,
        stream: new ServerStream({
          url: appConfigStore.config.errorLoggerUrl,
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
