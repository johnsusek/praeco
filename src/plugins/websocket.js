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

      // Create WebSocket using VueUse
      wsControls = useWebSocket(wsUrl, {
        immediate: true,
        autoReconnect: false,
        onConnected: (ws) => {
          // Create wrapper that mimics vue-native-websocket API
          const socketWrapper = {
            get readyState() {
              return ws ? ws.readyState : WebSocket.CLOSED;
            },
            send(data) {
              if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(data);
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
            onopen: null,
            onclose: null,
            onerror: null
          };

          component.$socket = socketWrapper;

          // Call the custom onopen handler if set
          if (socketWrapper.onopen) {
            socketWrapper.onopen.call(socketWrapper);
          }
        },
        onMessage: (ws, event) => {
          // Call the component's onmessage handler if defined via $options
          if (component.$options.sockets && component.$options.sockets.onmessage) {
            component.$options.sockets.onmessage(event);
          }
        },
        onDisconnected: (ws, event) => {
          // Call the custom onclose handler if set
          if (component.$socket && component.$socket.onclose) {
            component.$socket.onclose.call(component.$socket, event);
          }
        },
        onError: (ws, event) => {
          console.error('WebSocket error:', event);
          if (component.$socket && component.$socket.onerror) {
            component.$socket.onerror.call(component.$socket, event);
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
