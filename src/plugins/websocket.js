import { useWebSocket } from '@vueuse/core';

/**
 * WebSocket plugin for Vue 2 using VueUse
 * Provides similar API to vue-native-websocket for compatibility
 * Migrated from vue-native-websocket to VueUse
 */
export default {
  install(Vue, url) {
    // Store the WebSocket controls globally
    let wsControls = null;
    let wsUrl = url;

    // Add $connect method to Vue prototype
    Vue.prototype.$connect = function() {
      // Close existing connection if any
      if (wsControls && wsControls.close) {
        wsControls.close();
        wsControls = null;
      }

      // Store reference to component context
      const component = this;
      let isConnected = false;

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
          // If already connected, call the handler immediately
          if (isConnected && handler) {
            setTimeout(() => handler.call(this), 0);
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

      // Assign wrapper to $socket immediately
      component.$socket = socketWrapper;

      // Create WebSocket using VueUse
      wsControls = useWebSocket(wsUrl, {
        immediate: true,
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
    };

    // Add $disconnect method to Vue prototype
    Vue.prototype.$disconnect = function() {
      if (wsControls && wsControls.close) {
        wsControls.close();
        wsControls = null;
      }
      if (this.$socket) {
        this.$socket = null;
      }
    };

    // Initialize $socket as null
    Vue.prototype.$socket = null;
  }
};
