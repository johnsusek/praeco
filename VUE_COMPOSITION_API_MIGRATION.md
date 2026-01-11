# Vue 2.7 Composition API Migration Guide

## Overview

This guide helps migrate Praeco components from Vue 2 Options API to Vue 2.7 Composition API with `<script setup>` syntax.

Vue 2.7 is the final minor release of Vue 2 and backports several important features from Vue 3:
- Composition API (without requiring `@vue/composition-api` plugin)
- `<script setup>` syntax
- `defineComponent` with improved type inference
- CSS `v-bind` in SFCs

## Why Migrate to Composition API?

### Benefits
- **Better Code Organization**: Group related logic together instead of splitting by options
- **Improved Reusability**: Easily extract and share logic between components
- **Better TypeScript Support**: Enhanced type inference and IDE support
- **Smaller Bundle Size**: Tree-shakeable APIs
- **Easier Testing**: Pure functions are easier to test in isolation
- **Future-Ready**: Prepares codebase for eventual Vue 3 migration

### When to Use Composition API vs Options API

**Use Composition API when:**
- Components have complex logic that benefits from being grouped by feature
- You need to reuse logic across multiple components
- Working with large components that are hard to maintain
- Building new features from scratch

**Stick with Options API when:**
- Components are simple and straightforward
- Team is not yet familiar with Composition API
- Refactoring would provide minimal benefit

**Important**: Both APIs can coexist! Migrate incrementally as needed.

## Core Composition API Concepts

### Reactive State

#### ref
Use `ref()` for primitive values (strings, numbers, booleans):

```javascript
import { ref } from 'vue';

const count = ref(0);
const message = ref('Hello');

// Access/modify with .value
count.value++;
console.log(message.value);
```

#### reactive
Use `reactive()` for objects and arrays:

```javascript
import { reactive } from 'vue';

const state = reactive({
  user: {
    name: 'John',
    age: 30
  },
  items: []
});

// Access directly (no .value)
state.user.name = 'Jane';
state.items.push('new item');
```

### Computed Properties

```javascript
import { ref, computed } from 'vue';

const count = ref(0);

// Read-only computed
const doubled = computed(() => count.value * 2);

// Writable computed
const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(' ');
  }
});
```

### Watchers

```javascript
import { ref, watch, watchEffect } from 'vue';

const count = ref(0);
const message = ref('');

// Watch a single source
watch(count, (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`);
});

// Watch multiple sources
watch([count, message], ([newCount, newMsg], [oldCount, oldMsg]) => {
  console.log('Something changed');
});

// Watch with options
watch(count, callback, {
  immediate: true,
  deep: true
});

// watchEffect - automatically tracks dependencies
watchEffect(() => {
  console.log(`Count is ${count.value}`);
});
```

### Lifecycle Hooks

```javascript
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue';

onMounted(() => {
  console.log('Component mounted');
});

onUnmounted(() => {
  console.log('Component unmounted');
});
```

## Migration Patterns

### Pattern 1: Simple Component

**Before (Options API):**
```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script>
export default {
  name: 'SimpleComponent',
  
  data() {
    return {
      count: 0,
      message: 'Hello World'
    };
  },
  
  computed: {
    title() {
      return `Count is ${this.count}`;
    }
  },
  
  methods: {
    increment() {
      this.count++;
    }
  }
};
</script>
```

**After (Composition API with `<script setup>`):**
```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const count = ref(0);
const message = ref('Hello World');

const title = computed(() => `Count is ${count.value}`);

function increment() {
  count.value++;
}
</script>
```

### Pattern 2: Component with Props and Emits

**Before:**
```vue
<script>
export default {
  name: 'ChildComponent',
  
  props: {
    title: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  emits: ['update', 'delete'],
  
  methods: {
    handleUpdate() {
      this.$emit('update', this.count + 1);
    },
    
    handleDelete() {
      this.$emit('delete');
    }
  }
};
</script>
```

**After:**
```vue
<script setup>

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['update', 'delete']);

function handleUpdate() {
  emit('update', props.count + 1);
}

function handleDelete() {
  emit('delete');
}
</script>
```

### Pattern 3: Lifecycle Hooks

**Before:**
```vue
<script>
export default {
  data() {
    return {
      data: null
    };
  },
  
  mounted() {
    this.fetchData();
    window.addEventListener('resize', this.handleResize);
  },
  
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  
  methods: {
    async fetchData() {
      this.data = await fetch('/api/data').then(r => r.json());
    },
    
    handleResize() {
      console.log('Window resized');
    }
  }
};
</script>
```

**After:**
```vue
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const data = ref(null);

async function fetchData() {
  data.value = await fetch('/api/data').then(r => r.json());
}

function handleResize() {
  console.log('Window resized');
}

onMounted(() => {
  fetchData();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
```

### Pattern 4: Vuex Store Integration

**Before:**
```vue
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState(['user', 'settings']),
    ...mapGetters(['isLoggedIn', 'userFullName']),
    
    localComputed() {
      return this.user.name.toUpperCase();
    }
  },
  
  methods: {
    ...mapActions(['login', 'logout']),
    ...mapMutations(['SET_USER']),
    
    async handleLogin() {
      await this.login({ username: 'test', password: 'test' });
    }
  },
  
  mounted() {
    if (!this.isLoggedIn) {
      this.$router.push('/login');
    }
  }
};
</script>
```

**After:**
```vue
<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

// State
const user = computed(() => store.state.user);
const settings = computed(() => store.state.settings);

// Getters
const isLoggedIn = computed(() => store.getters.isLoggedIn);
const userFullName = computed(() => store.getters.userFullName);

// Local computed
const localComputed = computed(() => user.value.name.toUpperCase());

// Actions
async function handleLogin() {
  await store.dispatch('login', { username: 'test', password: 'test' });
}

function logout() {
  store.dispatch('logout');
}

// Mutations
function setUser(userData) {
  store.commit('SET_USER', userData);
}

onMounted(() => {
  if (!isLoggedIn.value) {
    router.push('/login');
  }
});
</script>
```

The previous example uses Vue 3-style `useStore`/`useRouter` helpers for familiarity. In Vue 2.7, adapt it as shown below.

**Note (Vue 2.7 adaptation of Pattern 4)**: For Praeco, since we're using Vue 2.7, `useStore` and `useRouter` are not built-in. Use `getCurrentInstance()` instead:
```vue
<script setup>
import { computed, getCurrentInstance } from 'vue';

const instance = getCurrentInstance();
const store = instance.proxy.$store;
const router = instance.proxy.$router;
const route = instance.proxy.$route;

// Now use store, router, and route as shown above
</script>
```

### Pattern 5: Watchers

**Before:**
```vue
<script>
export default {
  props: ['userId'],
  
  data() {
    return {
      user: null,
      searchQuery: ''
    };
  },
  
  watch: {
    userId: {
      immediate: true,
      handler(newId) {
        this.fetchUser(newId);
      }
    },
    
    searchQuery(newQuery, oldQuery) {
      console.log(`Search changed from "${oldQuery}" to "${newQuery}"`);
      this.search(newQuery);
    }
  },
  
  methods: {
    async fetchUser(id) {
      this.user = await fetch(`/api/users/${id}`).then(r => r.json());
    },
    
    search(query) {
      // Perform search
    }
  }
};
</script>
```

**After:**
```vue
<script setup>
import { ref, watch, toRefs } from 'vue';

const props = defineProps({
  userId: String
});

const { userId } = toRefs(props);
const user = ref(null);
const searchQuery = ref('');

async function fetchUser(id) {
  user.value = await fetch(`/api/users/${id}`).then(r => r.json());
}

function search(query) {
  // Perform search
}

// Watch prop with immediate option
watch(userId, (newId) => {
  fetchUser(newId);
}, { immediate: true });

// Watch reactive data
watch(searchQuery, (newQuery, oldQuery) => {
  console.log(`Search changed from "${oldQuery}" to "${newQuery}"`);
  search(newQuery);
});
</script>
```

### Pattern 6: Template Refs

**Before:**
```vue
<template>
  <div>
    <el-form ref="form">
      <!-- form fields -->
    </el-form>
    <button @click="submitForm">Submit</button>
  </div>
</template>

<script>
export default {
  methods: {
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('Form is valid');
        }
      });
    },
    
    resetForm() {
      this.$refs.form.resetFields();
    }
  }
};
</script>
```

**After:**
```vue
<template>
  <div>
    <el-form ref="formRef">
      <!-- form fields -->
    </el-form>
    <button @click="submitForm">Submit</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const formRef = ref(null);

function submitForm() {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log('Form is valid');
    }
  });
}

function resetForm() {
  formRef.value.resetFields();
}
</script>
```

## Practical Examples from Praeco

### Example 1: Migrating PraecoFormItem Component

**Original (Options API):**
```vue
<template>
  <el-form-item
    v-show="!(value && hidePreconfiguredFields.includes(prop)) || type === 'template'"
    :label="label"
    :prop="prop"
    :required="required">
    <slot />
  </el-form-item>
</template>

<script>
export default {
  props: [
    'value',
    'label',
    'prop',
    'required'
  ],
  
  computed: {
    hidePreconfiguredFields() {
      return this.$store.state.appconfig.config.hidePreconfiguredFields || [];
    },
    type() {
      return this.$route.meta.type;
    }
  }
};
</script>
```

_Note: This example is intentionally simplified to show the change in component structure. The real `PraecoFormItem.vue` component also defines additional props such as `labelWidth`, `rules`, `error`, `showMessage`, `inlineMessage`, and `size`; they would be migrated in exactly the same way as the props shown here._
**Migrated (Composition API):**
```vue
<template>
  <el-form-item
    v-show="!(value && hidePreconfiguredFields.includes(prop)) || type === 'template'"
    :label="label"
    :prop="prop"
    :required="required">
    <slot />
  </el-form-item>
</template>

<script setup>
import { computed, getCurrentInstance } from 'vue';

const props = defineProps({
  value: [String, Number, Boolean, Object, Array],
  label: String,
  prop: String,
  required: Boolean
});

const instance = getCurrentInstance();
const store = instance.proxy.$store;
const route = instance.proxy.$route;

const hidePreconfiguredFields = computed(
  () => store.state.appconfig.config.hidePreconfiguredFields || []
);

const type = computed(() => route.meta.type);
</script>
```

### Example 2: Migrating UpdateIndicator Component

**Original (Options API):**
```vue
<template>
  <span>
    <el-tag v-if="updateAvailable" type="info">
      <a href="https://github.com/johnsusek/praeco/releases" target="_blank" rel="noopener noreferrer">
        Update available
      </a>
    </el-tag>
    <el-tag type="info" class="m-w-xs">praeco {{ currentVersion }}</el-tag>
  </span>
</template>

<script>
import axios from 'axios';
import semver from 'semver';
import packageData from '@/../package.json';

export default {
  data() {
    return {
      currentVersion: packageData.version,
      latestRelease: {}
    };
  },

  computed: {
    updateAvailable() {
      if (!this.latestRelease.tag_name) return false;
      return semver.lt(this.currentVersion, this.latestRelease.tag_name);
    }
  },

  async mounted() {
    if (import.meta.env.DEV && sessionStorage.getItem('latestRelease')) {
      this.latestRelease = JSON.parse(sessionStorage.getItem('latestRelease'));
    } else {
      try {
        let res = await axios.get('/api-app/releases');
        if (res && res.data) {
          this.latestRelease = res.data[0];
          sessionStorage.setItem('latestRelease', JSON.stringify(this.latestRelease));
        }
      } catch (error) {}
    }
  }
};
</script>
```

**Migrated (Composition API):**
```vue
<template>
  <span>
    <el-tag v-if="updateAvailable" type="info">
      <a href="https://github.com/johnsusek/praeco/releases" target="_blank">
        Update available
      </a>
    </el-tag>
    <el-tag type="info">praeco {{ currentVersion }}</el-tag>
  </span>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import semver from 'semver';
import packageData from '@/../package.json';

const currentVersion = ref(packageData.version);
const latestRelease = ref({});

const updateAvailable = computed(() => {
  if (!latestRelease.value.tag_name) return false;
  return semver.lt(currentVersion.value, latestRelease.value.tag_name);
});

async function fetchLatestRelease() {
  if (import.meta.env.DEV && sessionStorage.getItem('latestRelease')) {
    latestRelease.value = JSON.parse(sessionStorage.getItem('latestRelease'));
  } else {
    try {
      const res = await axios.get('/api-app/releases');
      if (res && res.data) {
        latestRelease.value = res.data[0];
        sessionStorage.setItem('latestRelease', JSON.stringify(latestRelease.value));
      }
    } catch (error) {
      console.error('Failed to fetch latest release:', error);
    }
  }
}

onMounted(() => {
  fetchLatestRelease();
});
</script>
```

### Example 3: Migrating App.vue

**Original (Options API):**
```vue
<template>
  <div id="app">
    <!-- template content -->
  </div>
</template>

<script>
import UpdateIndicator from '@/components/UpdateIndicator.vue';
import { Splitpanes, Pane } from 'splitpanes';

export default {
  components: {
    UpdateIndicator,
    Splitpanes,
    Pane
  },

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

  methods: {
    onDragEnd(size) {
      this.sidebarWidth = size;
    }
  }
};
</script>
```

**Migrated (Composition API):**
```vue
<template>
  <div id="app">
    <!-- template content -->
  </div>
</template>

<script setup>
import { computed, onMounted, getCurrentInstance } from 'vue';
import UpdateIndicator from '@/components/UpdateIndicator.vue';
import { Splitpanes, Pane } from 'splitpanes';

const instance = getCurrentInstance();
const store = instance.proxy.$store;

const sidebarWidth = computed({
  get() {
    return store.state.ui.sidebarWidth;
  },
  set(value) {
    store.commit('ui/UPDATE_SIDEBAR_WIDTH', value);
  }
});

function onDragEnd(size) {
  sidebarWidth.value = size;
}

onMounted(() => {
  store.dispatch('server/fetchVersion');
  store.dispatch('server/fetchStatus');
  store.dispatch('elastalert/fetchConfig');
});
</script>
```

## Composables: Extracting Reusable Logic

One of the biggest advantages of Composition API is the ability to extract and reuse logic across components.

### Creating a Composable

Create `src/composables/useStore.js`:
```javascript
import { computed, getCurrentInstance } from 'vue';

export function useStore() {
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error('useStore must be called within a setup function');
  }
  return instance.proxy.$store;
}

export function useRouter() {
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error('useRouter must be called within a setup function');
  }
  return instance.proxy.$router;
}

export function useRoute() {
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error('useRoute must be called within a setup function');
  }
  return computed(() => instance.proxy.$route);
}
```

### Using the Composable

```vue
<script setup>
import { computed } from 'vue';
import { useStore, useRouter, useRoute } from '../composables/useStore';

const store = useStore();
const router = useRouter();
const route = useRoute();

const user = computed(() => store.state.user);

function navigateHome() {
  router.push('/');
}

console.log('Current route:', route.path);
</script>
```

### Example: useFetch Composable

Create `src/composables/useFetch.js`:
```javascript
import { ref, isRef, unref, watchEffect } from 'vue';

export function useFetch(url) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);

  async function doFetch() {
    loading.value = true;
    error.value = null;
    data.value = null;

    try {
      const urlValue = unref(url);
      const res = await fetch(urlValue);
      data.value = await res.json();
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  if (isRef(url)) {
    // If url is a ref, re-fetch when it changes
    watchEffect(doFetch);
  } else {
    // If url is static, fetch once
    doFetch();
  }

  return { data, error, loading, refetch: doFetch };
}
```

Usage:
```vue
<script setup>
import { useFetch } from '@/composables/useFetch';

const { data, error, loading, refetch } = useFetch('/api/users');
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>{{ data }}</div>
    <button @click="refetch">Reload</button>
  </div>
</template>
```

## VueUse: Composition Utilities

Praeco already includes `@vueuse/core` which provides many useful composables:

```vue
<script setup>
import { useLocalStorage, useDebounceFn, useEventListener } from '@vueuse/core';

// Persist state to localStorage
const count = useLocalStorage('my-count', 0);

// Debounced function
const debouncedSearch = useDebounceFn((query) => {
  console.log('Searching for:', query);
}, 500);

// Event listener with auto cleanup
useEventListener(window, 'resize', () => {
  console.log('Window resized');
});
</script>
```

Common VueUse composables:
- `useLocalStorage` - Reactive localStorage
- `useSessionStorage` - Reactive sessionStorage
- `useDebounceFn` / `useThrottleFn` - Debounce/throttle functions
- `useEventListener` - Auto-cleanup event listeners
- `useFetch` - Fetch API wrapper
- `useClipboard` - Clipboard operations
- `useTitle` - Reactive document title
- `useWindowSize` - Reactive window dimensions

See [VueUse documentation](https://vueuse.org/) for a complete list of composables, and ensure you are viewing the docs for the version you have installed (for example, `@vueuse/core` v11.x for Vue 2.7). Not all VueUse composables are compatible with Vue 2; some are Vue 3–only or have different requirements, so verify or test each composable before using it in Vue 2.7.

## Best Practices

### 1. Keep Components Focused
Extract complex logic into composables:

```javascript
// Good
const { user, loading, error } = useUser();
const { permissions } = usePermissions();

// Avoid: Too much logic in component
```

### 2. Use Proper Reactive Types
```javascript
// Two common patterns; pick one and use it consistently with your team:

// 1) Use ref for primitives and reactive for objects
const count = ref(0);
const message = ref('');

// reactive works well when you mostly access properties via dot-notation
const state = reactive({
  user: {},
  settings: {}
});

// 2) Or use ref for everything (primitives and objects)
const stateRef = ref({
  user: {},
  settings: {}
});
// This avoids reactivity loss when destructuring (a common reactive gotcha),
// but requires accessing stateRef.value instead of state.

// For props, use toRefs (or toRef) to maintain reactivity when destructuring
const props = defineProps({ userId: String });
const { userId } = toRefs(props);
```

### 3. Name Template Refs Consistently
```vue
<template>
  <el-form ref="formRef">
    <el-table ref="tableRef">
  </el-form>
</template>

<script setup>
import { ref } from 'vue';

const formRef = ref(null);
const tableRef = ref(null);
</script>
```

### 4. Group Related Logic
```javascript
// Group by feature
// ===== User Management =====
const user = ref(null);
const fetchUser = async () => { /* ... */ };
const updateUser = async () => { /* ... */ };

// ===== Form Validation =====
const formData = reactive({});
const validateForm = () => { /* ... */ };
const submitForm = () => { /* ... */ };
```

### 5. Use TypeScript for Better DX (Optional)

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

interface User {
  id: number;
  name: string;
  email: string;
}

const user = ref<User | null>(null);

const props = defineProps<{
  userId: number;
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'update', value: User): void;
  (e: 'delete', id: number): void;
}>();
</script>
```

## Common Gotchas

### 1. Remember `.value` for Refs
```javascript
// ❌ Wrong
const count = ref(0);
count++; // Won't work!

// ✅ Correct
count.value++;
```

Note: In templates, `.value` is automatically unwrapped:
```vue
<template>
  <!-- No .value needed in template -->
  <div>{{ count }}</div>
</template>
```

### 2. Destructuring Reactive Objects Loses Reactivity
```javascript
// ❌ Wrong - loses reactivity
const { name, age } = reactive({ name: 'John', age: 30 });

// ✅ Use toRefs
const state = reactive({ name: 'John', age: 30 });
const { name, age } = toRefs(state);

// ✅ Or access via state
console.log(state.name);
```

### 3. Watch on Reactive Object Properties
```javascript
const state = reactive({ count: 0 });

// ❌ Won't work
watch(state.count, () => { /* ... */ });

// ✅ Use getter function
watch(() => state.count, () => { /* ... */ });

// ✅ Or use toRefs
const { count } = toRefs(state);
watch(count, () => { /* ... */ });
```

### 4. getCurrentInstance Timing
```javascript
// ✅ Call at setup top level
const instance = getCurrentInstance();

// ❌ Don't call in async callbacks
setTimeout(() => {
  const instance = getCurrentInstance(); // null!
}, 100);
```

### 5. Template Refs Availability
```javascript
const myRef = ref(null);

onMounted(() => {
  // ✅ Available in onMounted
  console.log(myRef.value);
});

// ❌ Not available immediately
console.log(myRef.value); // null
```

## Migration Strategy

### 1. Incremental Approach (Recommended)
- Start with new components using Composition API
- Migrate existing components when making significant changes
- Both APIs can coexist

### 2. Component Priority
Migrate in this order:
1. **Utility components** - Small, reusable components
2. **New features** - Always use Composition API
3. **Complex components** - Components that would benefit most
4. **Simple components** - Migrate if time permits

### 3. Testing During Migration
- Keep existing tests working
- Component behavior should remain identical
- Test both isolated logic and component integration

## Additional Resources

- [Vue 2.7 Release Notes](https://blog.vuejs.org/posts/vue-2-7-naruto.html)
- [Vue 3 Composition API Docs](https://vuejs.org/guide/extras/composition-api-faq.html)
- [VueUse Documentation](https://vueuse.org/)
- [Vue 2 to Vue 3 Migration Guide](https://v3-migration.vuejs.org/)

## Conclusion

The Composition API in Vue 2.7 provides powerful tools for organizing and reusing code while maintaining backward compatibility with Vue 2. Migrate incrementally, starting with components that would benefit most from better organization and reusability.

Remember:
- Both APIs can coexist
- No need to migrate everything at once
- Focus on developer experience improvements
- Extract reusable logic into composables
- Leverage VueUse for common patterns

Happy migrating! 🚀
