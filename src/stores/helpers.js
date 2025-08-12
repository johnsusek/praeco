// Vue 2 Pinia composables helper
// This provides compatibility for using Pinia stores in Vue 2 Options API

export function mapStores(...stores) {
  const mapped = {};

  stores.forEach(useStore => {
    // Extract store name from the store function
    const storeName = useStore.name || useStore.$id;
    const camelCaseName = storeName.replace(/^use(.+)Store$/, '$1').toLowerCase();

    mapped[`${camelCaseName}Store`] = function() {
      return useStore();
    };
  });

  return mapped;
}

export function mapState(useStore, keys) {
  const mapped = {};

  if (Array.isArray(keys)) {
    keys.forEach(key => {
      mapped[key] = function() {
        const store = useStore();
        return store[key];
      };
    });
  } else if (typeof keys === 'object') {
    Object.keys(keys).forEach(key => {
      mapped[key] = function() {
        const store = useStore();
        const getter = keys[key];
        return typeof getter === 'function' ? getter.call(this, store) : store[getter];
      };
    });
  }

  return mapped;
}

export function mapGetters(useStore, keys) {
  return mapState(useStore, keys);
}

export function mapActions(useStore, keys) {
  const mapped = {};

  if (Array.isArray(keys)) {
    keys.forEach(key => {
      mapped[key] = function(...args) {
        const store = useStore();
        return store[key](...args);
      };
    });
  } else if (typeof keys === 'object') {
    Object.keys(keys).forEach(key => {
      mapped[key] = function(...args) {
        const store = useStore();
        const action = keys[key];
        return store[action](...args);
      };
    });
  }

  return mapped;
}
