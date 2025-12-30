import { useWebSocket } from '@vueuse/core';

/**
 * WebSocket plugin for Vue 2 using VueUse
 * Provides similar API to vue-native-websocket for compatibility
 * Migrated from vue-native-websocket to VueUse
 */
export default {
  install(Vue, wsUrl) {
    // WebSocket URL

    // Initialize $options.sockets for components that use it
    Vue.mixin({
      beforeCreate() {
        if (!this.$options.sockets) {
          this.$options.sockets = {};
        }
      }
    });

    // Add $connect method to Vue prototype
    Vue.prototype.$connect = function() {
      // Close existing connection if any
      if (this._wsControls && this._wsControls.close) {
        this._wsControls.close();
        this._wsControls = null;
      }

      // Store reference to component context
      const component = this;
      let isConnected = false;
      let wsControls = null;

      // Create wrapper first so it can be assigned immediately
      const socketWrapper = {
        get readyState() {
          return wsControls && wsControls.ws && wsControls.ws.value
            ? wsControls.ws.value.readyState
            : WebSocket.CLOSED;
        },
        send(data) {
          if (wsControls && wsControls.send) {
            wsControls.send(data);
          }
        },
        sendObj(obj) {
          this.send(JSON.stringify(obj));
        },
        close() {
          if (wsControls && wsControls.close) {
            wsControls.close();
          }
        },
        // These will be set by the component
        _onopen: null,
        _onclose: null,
        _onerror: null,
        // Use getters/setters to handle delayed onopen call
        get onopen() {
          return this._onopen;
        },
        set onopen(handler) {
          this._onopen = handler;
          // If already connected, call the handler asynchronously
          if (isConnected && handler) {
            queueMicrotask(() => handler.call(this));
          }
        },
        get onclose() {
          return this._onclose;
        },
        set onclose(handler) {
          this._onclose = handler;
        },
        get onerror() {
          return this._onerror;
        },
        set onerror(handler) {
          this._onerror = handler;
        }
      };

      // Assign wrapper to $socket
      component.$socket = socketWrapper;

      // Create WebSocket using VueUse - immediate: false for manual connection
      wsControls = useWebSocket(wsUrl, {
        immediate: false,
        autoReconnect: false,
        onConnected: () => {
          isConnected = true;
          // Call the custom onopen handler if already set
          if (socketWrapper._onopen) {
            socketWrapper._onopen.call(socketWrapper);
          }
        },
        onMessage: (_ws, event) => {
          // Call the component's onmessage handler if defined via $options
          if (component.$options.sockets && component.$options.sockets.onmessage) {
            component.$options.sockets.onmessage(event);
          }
        },
        onDisconnected: (ws, event) => {
          isConnected = false;
          // Call the custom onclose handler if set
          if (socketWrapper._onclose) {
            socketWrapper._onclose.call(socketWrapper, event);
          }
        },
        onError: (ws, event) => {
          console.error('WebSocket error:', event);
          if (socketWrapper._onerror) {
            socketWrapper._onerror.call(socketWrapper, event);
          }
        }
      });

      // Store controls on the component instance
      component._wsControls = wsControls;

      // Defer opening the connection to allow handlers to be set
      // This ensures onopen/onclose handlers can be set after $connect() is called
      queueMicrotask(() => {
        if (wsControls.open) {
          wsControls.open();
        }
      });
    };

    // Add $disconnect method to Vue prototype
    Vue.prototype.$disconnect = function() {
      const wsControls = this._wsControls;
      if (wsControls && wsControls.close) {
        wsControls.close();
        this._wsControls = null;
      }
      if (this.$socket) {
        this.$socket = null;
      }
    };
  }
};
