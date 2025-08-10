// EXAMPLE: App.vue converted to use Pinia stores directly
// This shows how the component would look after full migration

/*
BEFORE (using Vuex via this.$store):

computed: {
  sidebarWidth: {
    get() {
      return this.$store.state.ui.sidebarWidth;
    },
    set(value) {
      this.$store.commit('ui/UPDATE_SIDEBAR_WIDTH', value);
    }
  }
},

mounted() {
  this.$store.dispatch('server/fetchVersion');
  this.$store.dispatch('server/fetchStatus');
  this.$store.dispatch('elastalert/fetchConfig');
},
*/

// AFTER (using Pinia stores directly):

import { useUiStore, useServerStore, useElastalertStore } from '@/stores'
import { mapState, mapActions } from '@/stores/helpers'

export default {
  components: {
    UpdateIndicator
  },

  computed: {
    // Option 1: Direct store access
    uiStore() {
      return useUiStore()
    },
    
    sidebarWidth: {
      get() {
        return this.uiStore.sidebarWidth
      },
      set(value) {
        this.uiStore.updateSidebarWidth(value)
      }
    },

    // Option 2: Using helper (cleaner for many properties)
    ...mapState(useServerStore, ['version', 'status']),
    ...mapState(useElastalertStore, ['bufferTime', 'runEvery'])
  },

  mounted() {
    // Option 1: Direct method calls
    const serverStore = useServerStore()
    const elastalertStore = useElastalertStore()
    
    serverStore.fetchVersion()
    serverStore.fetchStatus()
    elastalertStore.fetchConfig()

    // Option 2: Using helper (if you have many actions)
    // ...mapActions(useServerStore, ['fetchVersion', 'fetchStatus']),
    // ...mapActions(useElastalertStore, ['fetchConfig']),
  },

  methods: {
    onDragEnd(size) {
      this.sidebarWidth = size
    }
  }
}

/*
Template remains the same:
- {{ $store.state.server.status }} becomes {{ status }}
- sidebarWidth computed property works the same way
*/