import { useWebSocket } from '@vueuse/core';

export default {
  install(app, wsUrl) {

    // mixin
    app.mixin({
      beforeCreate() {
        if (!this.$options.sockets) {
          this.$options.sockets = {};
        }
      }
    });

    // $connect
    app.config.globalProperties.$connect = function() {

      if (this._wsControls?.close) {
        this._wsControls.close();
        this._wsControls = null;
      }

      const component = this;
      let isConnected = false;
      let wsControls = null;

      const socketWrapper = {
        get readyState() {
          return wsControls?.ws?.value
            ? wsControls.ws.value.readyState
            : WebSocket.CLOSED;
        },
        send(data) {
          wsControls?.send?.(data);
        },
        sendObj(obj) {
          this.send(JSON.stringify(obj));
        },
        close() {
          wsControls?.close?.();
        },
        _onopen: null,
        _onclose: null,
        _onerror: null,
        get onopen() { return this._onopen; },
        set onopen(handler) {
          this._onopen = handler;
          if (isConnected && handler) {
            queueMicrotask(() => handler.call(this));
          }
        },
        get onclose() { return this._onclose; },
        set onclose(handler) { this._onclose = handler; },
        get onerror() { return this._onerror; },
        set onerror(handler) { this._onerror = handler; }
      };

      component.$socket = socketWrapper;

      wsControls = useWebSocket(wsUrl, {
        immediate: false,
        autoReconnect: false,
        onConnected: () => {
          isConnected = true;
          socketWrapper._onopen?.call(socketWrapper);
        },
        onMessage: (_ws, event) => {
          component.$options.sockets?.onmessage?.(event);
        },
        onDisconnected: (_ws, event) => {
          isConnected = false;
          socketWrapper._onclose?.call(socketWrapper, event);
        },
        onError: (_ws, event) => {
          socketWrapper._onerror?.call(socketWrapper, event);
        }
      });

      component._wsControls = wsControls;

      queueMicrotask(() => {
        wsControls?.open?.();
      });
    };

    // $disconnect
    app.config.globalProperties.$disconnect = function() {
      this._wsControls?.close?.();
      this._wsControls = null;
      this.$socket = null;
    };
  }
};
