# TypeScript Migration Guide

## Overview

This guide helps migrate Praeco from JavaScript to TypeScript for improved type safety, better IDE support, and enhanced maintainability. TypeScript is fully compatible with Vue 2.7 and all the libraries used in Praeco.

TypeScript provides:
- **Type Safety**: Catch errors at compile time instead of runtime
- **Better IDE Support**: Enhanced autocomplete, refactoring, and navigation
- **Self-Documenting Code**: Types serve as inline documentation
- **Improved Refactoring**: Confidently refactor with compiler-assisted changes
- **Better Collaboration**: Clear interfaces make team collaboration easier

## Why Migrate to TypeScript?

### Benefits

- **Catch Errors Early**: Type checking catches bugs before they reach production
- **Enhanced Developer Experience**: Better autocomplete, inline documentation, and refactoring tools
- **Maintainability**: Easier to understand code intent and refactor safely
- **Documentation**: Types serve as living documentation
- **Scalability**: Easier to manage large codebases
- **Community**: Most modern Vue libraries provide TypeScript definitions

### When to Migrate

**Migrate when:**
- Starting new features or major refactoring
- Team wants better IDE support and type safety
- Project is growing and maintainability becomes important
- Preparing for future Vue 3 migration (Vue 3 has first-class TypeScript support)

**Consider staying with JavaScript when:**
- Project is small and simple
- Team is not familiar with TypeScript
- Migration effort outweighs benefits for your use case

**Important**: You can migrate incrementally! JavaScript and TypeScript files can coexist.

## Installation

### Step 1: Install TypeScript and Type Definitions

```bash
npm install --save-dev typescript @types/node
npm install --save-dev @vue/runtime-dom  # For Vue 2.7 type support
```

### Step 2: Install Type Definitions for Dependencies

```bash
# Core dependencies
npm install --save-dev @types/lodash.clonedeep
npm install --save-dev @types/lodash.get
npm install --save-dev @types/lodash.throttle
npm install --save-dev @types/js-yaml
npm install --save-dev @types/semver
npm install --save-dev @types/validator

# Note: Some packages like axios, dayjs, and vue-router already include types
```

### Step 3: Create TypeScript Configuration

Create `tsconfig.json` in the project root:

```json
{
  "compilerOptions": {
    // Target and module
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    
    // Module resolution
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    
    // Type checking (initially relaxed for incremental migration)
    "strict": false,
    "noImplicitAny": false,
    "strictNullChecks": false,
    "strictFunctionTypes": false,
    "strictPropertyInitialization": false,
    "noImplicitThis": false,
    "alwaysStrict": false,
    
    // Additional checks
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    
    // Emit
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    
    // Vue specific
    "jsx": "preserve",
    "jsxFactory": "h",
    
    // Path mapping (match Vite/Webpack aliases)
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    
    // Skip lib check for faster compilation
    "skipLibCheck": true,
    
    // Allow JS files during migration
    "allowJs": true,
    "checkJs": false
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "coverage"
  ]
}
```

### Step 4: Update Vite Configuration

Update `vite.config.js` to handle TypeScript:

```javascript
import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import path from 'path';

export default defineConfig({
  plugins: [
    createVuePlugin({
      jsx: true,
      // Enable TypeScript in Vue files
      vueTemplateOptions: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('el-')
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  }
  // ... rest of config
});
```

### Step 5: Update ESLint for TypeScript (Optional)

If you want ESLint to check TypeScript files:

```bash
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Update `eslint.config.mjs`:

```javascript
import pluginVue from 'eslint-plugin-vue';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  // ... existing config
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  }
];
```

## Core TypeScript Concepts

### Basic Types

```typescript
// Primitives
let name: string = 'John';
let age: number = 30;
let isActive: boolean = true;
let value: null = null;
let notDefined: undefined = undefined;

// Arrays
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ['a', 'b', 'c'];

// Objects
let user: { name: string; age: number } = {
  name: 'John',
  age: 30
};

// Functions
function greet(name: string): string {
  return `Hello, ${name}`;
}

const add = (a: number, b: number): number => a + b;

// Any (use sparingly)
let anything: any = 'could be anything';

// Unknown (safer than any)
let something: unknown = 'unknown value';
if (typeof something === 'string') {
  console.log(something.toUpperCase()); // Type guard
}
```

### Interfaces and Types

```typescript
// Interface
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // Optional property
  readonly createdAt: Date; // Readonly property
}

// Type alias
type UserId = number;
type UserRole = 'admin' | 'user' | 'guest'; // Union type

// Extending interfaces
interface AdminUser extends User {
  role: 'admin';
  permissions: string[];
}

// Type intersections
type TimestampedUser = User & {
  createdAt: Date;
  updatedAt: Date;
};
```

### Generics

```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42);
const str = identity<string>('hello');

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Usage
const userResponse: ApiResponse<User> = {
  data: { id: 1, name: 'John', email: 'john@example.com', createdAt: new Date() },
  status: 200,
  message: 'Success'
};
```

### Type Guards and Narrowing

```typescript
// Type guard function
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// Using type guards
function processValue(value: string | number) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase()); // TypeScript knows it's a string
  } else {
    console.log(value.toFixed(2)); // TypeScript knows it's a number
  }
}

// Discriminated unions
interface Success {
  type: 'success';
  data: any;
}

interface Error {
  type: 'error';
  message: string;
}

type Result = Success | Error;

function handleResult(result: Result) {
  if (result.type === 'success') {
    console.log(result.data); // TypeScript knows it's Success
  } else {
    console.log(result.message); // TypeScript knows it's Error
  }
}
```

## Vue Component Migration

### Options API Components

#### Pattern 1: Simple Component

**Before (JavaScript):**
```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
export default {
  name: 'Counter',
  
  props: {
    initialCount: {
      type: Number,
      default: 0
    }
  },
  
  data() {
    return {
      count: this.initialCount
    };
  },
  
  computed: {
    title() {
      return `Counter: ${this.count}`;
    }
  },
  
  methods: {
    increment() {
      this.count++;
      this.$emit('update', this.count);
    }
  }
};
</script>
```

**After (TypeScript):**
```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Counter',
  
  props: {
    initialCount: {
      type: Number,
      default: 0
    }
  },
  
  data() {
    return {
      count: this.initialCount as number
    };
  },
  
  computed: {
    title(): string {
      return `Counter: ${this.count}`;
    }
  },
  
  methods: {
    increment(): void {
      this.count++;
      this.$emit('update', this.count);
    }
  }
});
</script>
```

#### Pattern 2: Component with Complex Props

**TypeScript:**
```vue
<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface User {
  id: number;
  name: string;
  email: string;
}

export default defineComponent({
  name: 'UserCard',
  
  props: {
    user: {
      type: Object as PropType<User>,
      required: true
    },
    mode: {
      type: String as PropType<'view' | 'edit'>,
      default: 'view'
    },
    tags: {
      type: Array as PropType<string[]>,
      default: () => []
    }
  },
  
  emits: {
    // Typed emit validator
    'update:user': (user: User) => true,
    'delete': (id: number) => true
  },
  
  computed: {
    displayName(): string {
      return this.user.name.toUpperCase();
    }
  },
  
  methods: {
    handleUpdate(): void {
      const updatedUser: User = {
        ...this.user,
        name: 'New Name'
      };
      this.$emit('update:user', updatedUser);
    },
    
    handleDelete(): void {
      this.$emit('delete', this.user.id);
    }
  }
});
</script>
```

### Composition API with TypeScript

#### Pattern 1: Basic Setup

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const count = ref<number>(0);

const title = computed<string>(() => `Counter: ${count.value}`);

function increment(): void {
  count.value++;
}
</script>
```

#### Pattern 2: Props and Emits

```vue
<template>
  <div>
    <h1>{{ user.name }}</h1>
    <p>{{ user.email }}</p>
    <button @click="handleUpdate">Update</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Props {
  user: User;
  mode?: 'view' | 'edit';
}

interface Emits {
  (e: 'update', user: User): void;
  (e: 'delete', id: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'view'
});

const emit = defineEmits<Emits>();

const displayName = computed<string>(() => props.user.name.toUpperCase());

function handleUpdate(): void {
  const updatedUser: User = {
    ...props.user,
    name: 'New Name'
  };
  emit('update', updatedUser);
}
</script>
```

#### Pattern 3: Ref Type Inference

```vue
<script setup lang="ts">
import { ref, Ref } from 'vue';

// Type inference
const count = ref(0); // Ref<number>
const message = ref('hello'); // Ref<string>

// Explicit typing
const user = ref<User | null>(null);

// Array with explicit type
const items = ref<string[]>([]);

// Complex object
interface FormData {
  name: string;
  email: string;
  age: number;
}

const form = ref<FormData>({
  name: '',
  email: '',
  age: 0
});
</script>
```

### Template Refs

```vue
<template>
  <div>
    <el-form ref="formRef">
      <el-input ref="inputRef" v-model="value" />
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElForm, ElInput } from 'element-ui';

// Template refs with proper typing
const formRef = ref<InstanceType<typeof ElForm> | null>(null);
const inputRef = ref<InstanceType<typeof ElInput> | null>(null);

onMounted(() => {
  // Access with null check
  formRef.value?.validate((valid: boolean) => {
    console.log('Form valid:', valid);
  });
  
  inputRef.value?.focus();
});
</script>
```

## Vuex Store Migration

### Store Module Types

**Before (JavaScript - `src/store/ui.js`):**
```javascript
export default {
  namespaced: true,

  state: {
    sidebarWidth: [20, 80]
  },

  mutations: {
    UPDATE_SIDEBAR_WIDTH(state, payload) {
      state.sidebarWidth = payload;
    }
  },

  getters: {
    isExpanded: (state) => state.sidebarWidth[0] > 30
  },

  actions: {
    toggleSidebar({ commit, state }) {
      const newWidth = state.sidebarWidth[0] > 30 ? [10, 90] : [30, 70];
      commit('UPDATE_SIDEBAR_WIDTH', newWidth);
    }
  }
};
```

**After (TypeScript - `src/store/ui.ts`):**
```typescript
import { Module } from 'vuex';

// Define state interface
interface UiState {
  sidebarWidth: [number, number];
}

// Define root state (for strongly typed access to other modules)
interface RootState {
  ui: UiState;
  // other modules...
}

const uiModule: Module<UiState, RootState> = {
  namespaced: true,

  state: (): UiState => ({
    sidebarWidth: [20, 80]
  }),

  mutations: {
    UPDATE_SIDEBAR_WIDTH(state: UiState, payload: [number, number]): void {
      state.sidebarWidth = payload;
    }
  },

  getters: {
    isExpanded: (state: UiState): boolean => state.sidebarWidth[0] > 30
  },

  actions: {
    toggleSidebar({ commit, state }): void {
      const newWidth: [number, number] = 
        state.sidebarWidth[0] > 30 ? [10, 90] : [30, 70];
      commit('UPDATE_SIDEBAR_WIDTH', newWidth);
    }
  }
};

export default uiModule;
```

### Async Actions with Types

**TypeScript (`src/store/server.ts`):**
```typescript
import { Module } from 'vuex';
import axios, { AxiosResponse } from 'axios';

interface Version {
  version: string;
  elastalert: string;
  praeco: string;
}

interface Status {
  running: boolean;
  enabled: boolean;
}

interface ServerState {
  version: Version | null;
  status: Status | null;
  error: string | null;
}

interface RootState {
  server: ServerState;
}

const serverModule: Module<ServerState, RootState> = {
  namespaced: true,

  state: (): ServerState => ({
    version: null,
    status: null,
    error: null
  }),

  mutations: {
    SET_VERSION(state: ServerState, version: Version): void {
      state.version = version;
    },
    
    SET_STATUS(state: ServerState, status: Status): void {
      state.status = status;
    },
    
    SET_ERROR(state: ServerState, error: string): void {
      state.error = error;
    }
  },

  getters: {
    isServerRunning: (state: ServerState): boolean => {
      return state.status?.running ?? false;
    }
  },

  actions: {
    async fetchVersion({ commit }): Promise<void> {
      try {
        const res: AxiosResponse<Version> = await axios.get('/api-app/version');
        commit('SET_VERSION', res.data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        commit('SET_ERROR', message);
        console.error('Failed to fetch version:', error);
      }
    },
    
    async fetchStatus({ commit }): Promise<void> {
      try {
        const res: AxiosResponse<Status> = await axios.get('/api-app/status');
        commit('SET_STATUS', res.data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        commit('SET_ERROR', message);
        console.error('Failed to fetch status:', error);
      }
    }
  }
};

export default serverModule;
```

### Store Root Types

**Create `src/store/types.ts`:**
```typescript
import { Store } from 'vuex';

// State interfaces
export interface UiState {
  sidebarWidth: [number, number];
}

export interface ServerState {
  version: {
    version: string;
    elastalert: string;
    praeco: string;
  } | null;
  status: {
    running: boolean;
    enabled: boolean;
  } | null;
  error: string | null;
}

export interface ConfigState {
  path: string;
  type: string;
  valid: boolean;
}

// Root state
export interface RootState {
  ui: UiState;
  server: ServerState;
  config: ConfigState;
  // Add other modules...
}

// Augment Vuex types for Vue components
declare module 'vue/types/vue' {
  interface Vue {
    $store: Store<RootState>;
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    store?: Store<RootState>;
  }
}
```

### Using Store in Components

```vue
<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import { RootState } from '@/store/types';
import { Store } from 'vuex';

const instance = getCurrentInstance();
const store = instance?.proxy.$store as Store<RootState>;

// Strongly typed state access
const sidebarWidth = computed<[number, number]>(() => store.state.ui.sidebarWidth);

const version = computed(() => store.state.server.version);

// Strongly typed getters
const isExpanded = computed<boolean>(() => store.getters['ui/isExpanded']);

// Strongly typed mutations
function updateSidebar(width: [number, number]): void {
  store.commit('ui/UPDATE_SIDEBAR_WIDTH', width);
}

// Strongly typed actions
async function fetchData(): Promise<void> {
  await store.dispatch('server/fetchVersion');
  await store.dispatch('server/fetchStatus');
}
</script>
```

## Router Migration

**Before (JavaScript - `router.js`):**
```javascript
import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    }
  ]
});
```

**After (TypeScript - `router.ts`):**
```typescript
import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

// Define custom meta fields
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    title?: string;
    type?: string;
  }
}

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { 
      requiresAuth: true,
      title: 'Home'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/Login.vue'),
    meta: {
      title: 'Login'
    }
  }
];

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// Typed navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth) {
    // Check auth and redirect
    const isAuthenticated = true; // Your auth check
    if (!isAuthenticated) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
```

## Utility Functions Migration

### Pattern 1: Simple Utility

**Before (JavaScript):**
```javascript
// src/lib/string.js
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str, length) {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
```

**After (TypeScript):**
```typescript
// src/lib/string.ts
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
```

### Pattern 2: Function with Optional Parameters

**TypeScript:**
```typescript
// src/lib/formatter.ts
interface FormatOptions {
  locale?: string;
  currency?: string;
  decimals?: number;
}

export function formatNumber(
  num: number, 
  options: FormatOptions = {}
): string {
  const { 
    locale = 'en-US', 
    currency = 'USD', 
    decimals = 2 
  } = options;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
}
```

### Pattern 3: Working with API Responses

**TypeScript:**
```typescript
// src/lib/api.ts
import axios, { AxiosResponse } from 'axios';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export async function fetchUser(id: number): Promise<User> {
  const response: AxiosResponse<ApiResponse<User>> = 
    await axios.get(`/api/users/${id}`);
  return response.data.data;
}

export async function fetchUsers(): Promise<User[]> {
  const response: AxiosResponse<ApiResponse<User[]>> = 
    await axios.get('/api/users');
  return response.data.data;
}

// Generic API fetcher
export async function fetchApi<T>(url: string): Promise<T> {
  const response: AxiosResponse<ApiResponse<T>> = await axios.get(url);
  return response.data.data;
}

// Usage
const user = await fetchApi<User>('/api/users/1');
const users = await fetchApi<User[]>('/api/users');
```

### Pattern 4: Type Guards for Runtime Checks

**TypeScript:**
```typescript
// src/lib/guards.ts

// Type guard for objects
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Type guard for arrays
export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

// Specific type guard
export interface User {
  id: number;
  name: string;
  email: string;
}

export function isUser(value: unknown): value is User {
  return (
    isObject(value) &&
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    typeof value.email === 'string'
  );
}

// Usage
function processData(data: unknown): void {
  if (isUser(data)) {
    console.log(data.name); // TypeScript knows it's a User
  } else if (isArray<string>(data)) {
    console.log(data.join(', ')); // TypeScript knows it's string[]
  }
}
```

## Testing with TypeScript

### Unit Tests

**Before (JavaScript):**
```javascript
// tests/unit/components/Counter.spec.js
import { mount } from '@vue/test-utils';
import Counter from '@/components/Counter.vue';

describe('Counter.vue', () => {
  it('increments count when button is clicked', () => {
    const wrapper = mount(Counter, {
      propsData: {
        initialCount: 5
      }
    });
    
    wrapper.find('button').trigger('click');
    expect(wrapper.vm.count).to.equal(6);
  });
});
```

**After (TypeScript):**
```typescript
// tests/unit/components/Counter.spec.ts
import { mount, Wrapper } from '@vue/test-utils';
import Counter from '@/components/Counter.vue';

describe('Counter.vue', () => {
  let wrapper: Wrapper<Vue>;
  
  beforeEach(() => {
    wrapper = mount(Counter, {
      propsData: {
        initialCount: 5
      }
    });
  });
  
  afterEach(() => {
    wrapper.destroy();
  });
  
  it('increments count when button is clicked', () => {
    wrapper.find('button').trigger('click');
    expect((wrapper.vm as any).count).to.equal(6);
  });
  
  it('emits update event with new count', async () => {
    wrapper.find('button').trigger('click');
    await wrapper.vm.$nextTick();
    
    expect(wrapper.emitted('update')).to.exist;
    expect(wrapper.emitted('update')![0]).to.deep.equal([6]);
  });
});
```

### Vitest Configuration for TypeScript

Update `vitest.config.js`:

```javascript
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue2';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/unit/setup.js']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  }
});
```

### Store Tests

**TypeScript:**
```typescript
// tests/unit/store/ui.spec.ts
import { createStore, Store } from 'vuex';
import uiModule from '@/store/ui';
import { UiState } from '@/store/types';

describe('ui store', () => {
  let store: Store<{ ui: UiState }>;
  
  beforeEach(() => {
    store = createStore({
      modules: {
        ui: uiModule
      }
    });
  });
  
  it('updates sidebar width', () => {
    const newWidth: [number, number] = [30, 70];
    store.commit('ui/UPDATE_SIDEBAR_WIDTH', newWidth);
    expect(store.state.ui.sidebarWidth).to.deep.equal(newWidth);
  });
  
  it('calculates isExpanded getter', () => {
    store.commit('ui/UPDATE_SIDEBAR_WIDTH', [40, 60]);
    expect(store.getters['ui/isExpanded']).to.be.true;
    
    store.commit('ui/UPDATE_SIDEBAR_WIDTH', [20, 80]);
    expect(store.getters['ui/isExpanded']).to.be.false;
  });
});
```

## Practical Examples from Praeco

### Example 1: Migrating PraecoFormItem

**Original (JavaScript):**
```vue
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

**Migrated (TypeScript with Options API):**
```vue
<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'PraecoFormItem',
  
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array] as PropType<any>,
      default: undefined
    },
    label: {
      type: String,
      default: ''
    },
    prop: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  
  computed: {
    hidePreconfiguredFields(): string[] {
      return this.$store.state.appconfig.config.hidePreconfiguredFields || [];
    },
    
    type(): string | undefined {
      return this.$route.meta?.type;
    }
  }
});
</script>
```

**Migrated (TypeScript with Composition API):**
```vue
<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';

interface Props {
  value?: any;
  label?: string;
  prop?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  value: undefined,
  label: '',
  prop: '',
  required: false
});

const instance = getCurrentInstance();
const store = instance?.proxy.$store;
const route = instance?.proxy.$route;

const hidePreconfiguredFields = computed<string[]>(
  () => store?.state.appconfig.config.hidePreconfiguredFields || []
);

const type = computed<string | undefined>(
  () => route?.meta?.type
);
</script>
```

### Example 2: Migrating API Service

**Original (JavaScript - `src/lib/elasticSearchMetadata.js`):**
```javascript
import axios from 'axios';

export async function fetchIndexes() {
  const res = await axios.get('/api-app/metadata/indices');
  return res.data;
}

export async function fetchFields(index) {
  const res = await axios.get(`/api-app/metadata/indices/${index}`);
  return res.data;
}
```

**Migrated (TypeScript - `src/lib/elasticSearchMetadata.ts`):**
```typescript
import axios, { AxiosResponse } from 'axios';

export interface Index {
  name: string;
  health: string;
  status: string;
  docsCount: number;
}

export interface Field {
  name: string;
  type: string;
  searchable: boolean;
  aggregatable: boolean;
}

interface ApiResponse<T> {
  data: T;
  status: string;
}

export async function fetchIndexes(): Promise<Index[]> {
  const res: AxiosResponse<ApiResponse<Index[]>> = 
    await axios.get('/api-app/metadata/indices');
  return res.data.data;
}

export async function fetchFields(index: string): Promise<Field[]> {
  const res: AxiosResponse<ApiResponse<Field[]>> = 
    await axios.get(`/api-app/metadata/indices/${index}`);
  return res.data.data;
}

export async function searchFields(
  index: string, 
  query: string
): Promise<Field[]> {
  const fields = await fetchFields(index);
  return fields.filter(field => 
    field.name.toLowerCase().includes(query.toLowerCase())
  );
}
```

### Example 3: Migrating Chart Options

**Original (JavaScript):**
```javascript
export function getChartOptions(data, title) {
  return {
    title: {
      text: title
    },
    xAxis: {
      data: data.map(d => d.date)
    },
    yAxis: {},
    series: [{
      type: 'line',
      data: data.map(d => d.value)
    }]
  };
}
```

**Migrated (TypeScript):**
```typescript
import { EChartsOption } from 'echarts';

export interface ChartDataPoint {
  date: string;
  value: number;
}

export function getChartOptions(
  data: ChartDataPoint[], 
  title: string
): EChartsOption {
  return {
    title: {
      text: title
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      type: 'line',
      data: data.map(d => d.value)
    }]
  };
}
```

### Example 4: Migrating Logger

**Original (JavaScript - `src/lib/logger.js`):**
```javascript
import bunyan from 'browser-bunyan';

const logger = bunyan.createLogger({
  name: 'praeco',
  streams: [{
    level: 'debug',
    stream: new bunyan.ConsoleFormattedStream()
  }]
});

export default logger;
```

**Migrated (TypeScript - `src/lib/logger.ts`):**
```typescript
import bunyan, { LogLevel } from 'browser-bunyan';

interface LoggerConfig {
  name: string;
  level?: LogLevel;
}

function createLogger(config: LoggerConfig): bunyan {
  return bunyan.createLogger({
    name: config.name,
    streams: [{
      level: config.level || 'debug',
      stream: new bunyan.ConsoleFormattedStream()
    }]
  });
}

const logger = createLogger({ name: 'praeco' });

export default logger;

// Type-safe logging helpers
export function logError(message: string, error: Error): void {
  logger.error({ err: error }, message);
}

export function logInfo(message: string, data?: Record<string, unknown>): void {
  logger.info(data || {}, message);
}

export function logDebug(message: string, data?: Record<string, unknown>): void {
  logger.debug(data || {}, message);
}
```

## Composables with TypeScript

### Creating Typed Composables

**src/composables/useApi.ts:**
```typescript
import { ref, Ref } from 'vue';
import axios, { AxiosError } from 'axios';

interface UseApiReturn<T> {
  data: Ref<T | null>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  execute: () => Promise<void>;
}

export function useApi<T>(url: string): UseApiReturn<T> {
  const data = ref<T | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  async function execute(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get<T>(url);
      data.value = response.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        error.value = err.message;
      } else if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'An unknown error occurred';
      }
    } finally {
      loading.value = false;
    }
  }

  return {
    data,
    loading,
    error,
    execute
  };
}
```

**Usage:**
```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { useApi } from '@/composables/useApi';

interface User {
  id: number;
  name: string;
  email: string;
}

const { data: user, loading, error, execute } = useApi<User>('/api/user');

onMounted(() => {
  execute();
});
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else-if="user">
      <h1>{{ user.name }}</h1>
      <p>{{ user.email }}</p>
    </div>
  </div>
</template>
```

### Store Composables

**src/composables/useStore.ts:**
```typescript
import { computed, getCurrentInstance, ComputedRef } from 'vue';
import { Store } from 'vuex';
import { RootState } from '@/store/types';

export function useStore(): Store<RootState> {
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error('useStore must be called within a setup function');
  }
  return instance.proxy.$store;
}

// Helper for typed state access
export function useState<T>(
  module: keyof RootState,
  key: string
): ComputedRef<T> {
  const store = useStore();
  return computed(() => (store.state[module] as any)[key]);
}

// Helper for typed getters
export function useGetter<T>(path: string): ComputedRef<T> {
  const store = useStore();
  return computed(() => store.getters[path]);
}

// Usage example
// const sidebarWidth = useState<[number, number]>('ui', 'sidebarWidth');
// const isExpanded = useGetter<boolean>('ui/isExpanded');
```

## Best Practices

### 1. Start with `strict: false` in tsconfig.json

When starting migration, use relaxed settings:

```json
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": false,
    "allowJs": true,
    "checkJs": false
  }
}
```

Then gradually enable stricter checks:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 2. Prefer Interfaces Over Types for Objects

```typescript
// ✅ Good - use interface for objects
interface User {
  id: number;
  name: string;
  email: string;
}

// ✅ Good - use type for unions, primitives, and tuples
type UserId = string | number;
type Coordinates = [number, number];
type Status = 'pending' | 'active' | 'inactive';
```

### 3. Use Proper Type Annotations

```typescript
// ✅ Good - explicit return types
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Good - explicit parameter types
function processUser(user: User): void {
  console.log(user.name);
}

// ❌ Avoid - implicit any
function doSomething(data) {  // Parameter 'data' implicitly has 'any' type
  console.log(data);
}
```

### 4. Avoid `any`, Use `unknown` Instead

```typescript
// ❌ Bad - any disables type checking
function processData(data: any): void {
  console.log(data.name); // No error even if name doesn't exist
}

// ✅ Better - unknown requires type checking
function processData(data: unknown): void {
  if (typeof data === 'object' && data !== null && 'name' in data) {
    console.log((data as { name: string }).name);
  }
}
```

### 5. Use Utility Types

```typescript
// Partial - makes all properties optional
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>; // All properties optional

function updateUser(id: number, updates: Partial<User>): void {
  // Can update any subset of properties
}

// Pick - select specific properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit - exclude specific properties
type UserWithoutId = Omit<User, 'id'>;

// Required - makes all properties required
type RequiredUser = Required<PartialUser>;

// Readonly - makes all properties readonly
type ReadonlyUser = Readonly<User>;

// Record - create object type with specific keys and values
type UserMap = Record<number, User>;
```

### 6. Leverage Type Inference

```typescript
// ✅ Good - let TypeScript infer when obvious
const count = 0; // Inferred as number
const message = 'hello'; // Inferred as string
const items = [1, 2, 3]; // Inferred as number[]

// ✅ Good - explicit when not obvious
const user: User = fetchUser();
const result: Promise<string> = asyncOperation();
```

### 7. Use Const Assertions for Literal Types

```typescript
// Without const assertion
const colors = ['red', 'green', 'blue']; // Type: string[]

// With const assertion
const colors = ['red', 'green', 'blue'] as const; // Type: readonly ["red", "green", "blue"]

// Useful for config objects
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
} as const;

// Type of config.apiUrl is 'https://api.example.com', not string
```

### 8. Create Type Declaration Files for External Libraries

If a library doesn't have types, create a declaration file:

**src/types/my-library.d.ts:**
```typescript
declare module 'my-untyped-library' {
  export function doSomething(arg: string): number;
  
  export interface Config {
    option1: boolean;
    option2: string;
  }
  
  export default function init(config: Config): void;
}
```

## Common Gotchas

### 1. Vue 2 Component Type Inference

```typescript
// ❌ Wrong - loses type inference
const MyComponent = {
  props: {
    value: Number
  }
};

// ✅ Correct - use defineComponent
import { defineComponent } from 'vue';

const MyComponent = defineComponent({
  props: {
    value: Number
  }
});
```

### 2. PropType for Complex Props

```typescript
import { PropType } from 'vue';

interface User {
  id: number;
  name: string;
}

// ❌ Wrong - type won't be inferred correctly
props: {
  user: Object
}

// ✅ Correct - use PropType
props: {
  user: {
    type: Object as PropType<User>,
    required: true
  }
}
```

### 3. Refs Need Type Arguments for Objects

```typescript
import { ref } from 'vue';

interface User {
  id: number;
  name: string;
}

// ❌ Wrong - inferred as Ref<never>
const user = ref();

// ✅ Correct - explicit type
const user = ref<User | null>(null);
```

### 4. Event Emits Need Proper Types

```typescript
// ❌ Wrong - no type checking
emits: ['update', 'delete']

// ✅ Correct - typed emits (Options API)
emits: {
  update: (value: number) => true,
  delete: (id: number) => true
}

// ✅ Correct - typed emits (Composition API)
interface Emits {
  (e: 'update', value: number): void;
  (e: 'delete', id: number): void;
}

const emit = defineEmits<Emits>();
```

### 5. Template Refs Require Explicit Types

```vue
<template>
  <el-form ref="formRef">
    <!-- content -->
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElForm } from 'element-ui';

// ❌ Wrong - type is Ref<never>
const formRef = ref();

// ✅ Correct - explicit type
const formRef = ref<InstanceType<typeof ElForm> | null>(null);
</script>
```

### 6. Vue Router Meta Fields

```typescript
// Need to augment vue-router types
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    title?: string;
    roles?: string[];
  }
}

// Now you can use strongly typed meta
router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth) { // TypeScript knows this exists
    // Check auth
  }
  next();
});
```

### 7. Vuex Module Registration

```typescript
// ❌ Wrong - loses module types
store.registerModule('myModule', myModule);

// ✅ Better - keep type through import
import myModule from './modules/myModule';

// In your components, use string literals for autocomplete
store.state.myModule // Won't have autocomplete

// Better: Create typed helpers
function useMyModule() {
  return {
    state: computed(() => store.state.myModule),
    someGetter: computed(() => store.getters['myModule/someGetter'])
  };
}
```

## Migration Strategy

### Incremental Approach (Recommended)

Migrate gradually to minimize risk and maintain a working application:

1. **Setup TypeScript** (Week 1)
   - Install dependencies
   - Create `tsconfig.json`
   - Update build configuration
   - Add type declaration files

2. **Migrate Utility Functions** (Week 2)
   - Start with pure functions (no Vue dependencies)
   - `src/lib/*.js` → `src/lib/*.ts`
   - Add types for parameters and return values
   - Create shared type definitions

3. **Migrate Store Modules** (Week 3-4)
   - Create `src/store/types.ts` with state interfaces
   - Migrate one module at a time
   - `src/store/ui.js` → `src/store/ui.ts`
   - Update components using migrated modules

4. **Migrate Simple Components** (Week 5-6)
   - Start with leaf components (no children)
   - Add `lang="ts"` to script tags
   - Type props, computed, and methods
   - Keep template unchanged

5. **Migrate Complex Components** (Week 7-8)
   - Parent components and views
   - Components with many props and events
   - Form components with validation

6. **Migrate Router and Main** (Week 9)
   - `router.js` → `router.ts`
   - `main.js` → `main.ts`
   - Update entry point in `index.html` if needed

7. **Enable Strict Mode** (Week 10)
   - Enable `strict: true` in tsconfig.json
   - Fix remaining type errors
   - Remove unnecessary `any` types

### Priority Order for Praeco

Based on dependencies and complexity:

| File/Module | Priority | Reason |
|-------------|----------|--------|
| `src/lib/*.js` | 1 (Start) | Pure functions, no dependencies |
| `src/store/types.ts` | 2 | Needed for store migration |
| `src/store/ui.ts` | 3 | Simplest store module |
| `src/store/server.ts` | 4 | Simple async store |
| `src/store/metadata.ts` | 5 | Similar to server store |
| Utility components | 6 | Small, reusable components |
| Form components | 7 | More complex, many props |
| View components | 8 | Use other components |
| `router.ts` | 9 | Depends on views |
| `main.ts` | 10 (Last) | Entry point |

### File-by-File Checklist

For each file migration:

- [ ] Rename `.js` to `.ts` (or add `lang="ts"` to `.vue`)
- [ ] Add type annotations to function parameters
- [ ] Add return type annotations to functions
- [ ] Replace `any` with proper types
- [ ] Add interfaces for complex objects
- [ ] Ensure imports do **not** use `.ts`/`.tsx` extensions (use `./module`, not `./module.ts`)
- [ ] Fix all TypeScript errors
- [ ] Run tests to ensure functionality unchanged
- [ ] Commit changes

### Testing During Migration

```bash
# Type check without emitting files
npx tsc --noEmit

# Type check specific files
npx tsc --noEmit src/store/ui.ts

# Run tests
npm run test:unit

# Run linter
npm run lint
```

## Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Vue 2 TypeScript Support](https://v2.vuejs.org/v2/guide/typescript.html)
- [Vuex TypeScript Support](https://vuex.vuejs.org/guide/typescript-support.html)
- [Vue Router TypeScript Support](https://router.vuejs.org/guide/advanced/typescript.html)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) - Type definitions for popular libraries

## Conclusion

Migrating to TypeScript provides significant benefits in type safety, maintainability, and developer experience. The key to successful migration is:

- **Start Small**: Begin with utility functions and simple modules
- **Be Incremental**: Migrate one file/module at a time
- **Test Thoroughly**: Ensure behavior remains unchanged
- **Use Strict Mode Gradually**: Enable strict checks incrementally
- **Document Types**: Create clear interfaces and type definitions

Remember:
- JavaScript and TypeScript can coexist during migration
- Focus on high-value files first (frequently changed, complex logic)
- Don't over-engineer types - start simple and refine
- Use `any` temporarily if needed, but plan to replace it
- Leverage IDE tools for refactoring and type checking

Happy migrating! 🚀
