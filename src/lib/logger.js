import { createLogger, ERROR, stdSerializers } from 'browser-bunyan';
import { ServerStream } from '@browser-bunyan/server-stream';
import { useAppconfigStore } from '@/stores';

let bunyan = null;

export function initLogging() {
  let options = {
    name: 'praeco',
    serializers: stdSerializers,
    src: true
  };

  const appconfigStore = useAppconfigStore();
  if (appconfigStore.config.errorLoggerUrl) {
    options.streams = [
      {
        level: ERROR,
        stream: new ServerStream({
          url: appconfigStore.config.errorLoggerUrl,
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
