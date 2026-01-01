# Vuex to Pinia Migration Guide for Praeco

## Status: Partial Migration

This document describes the migration from Vuex to Pinia for the Praeco project. The migration has been started with the core infrastructure in place.

## Completed Work

### 1. Dependencies
- ✅ Installed Pinia v2.3.1
- ✅ Removed Vuex from package.json
- ✅ Installed with `CYPRESS_INSTALL_BINARY=0` flag to avoid network issues

### 2. Store Infrastructure
Created new Pinia stores in `src/stores/`:

- ✅ **index.js** - Main Pinia setup with persistence plugin
- ✅ **ui.js** - UI state store (sidebar width)
- ✅ **appconfig.js** - Application configuration store
- ✅ **server.js** - Server status and version store
- ✅ **elastalert.js** - Elastalert configuration store
- ✅ **metadata.js** - Elasticsearch metadata store (indices, mappings, fields)
- ✅ **configs.js** - Rules and templates configuration store
- ⚠️ **config/settings.js** - Partially created
- ⚠️ **config/query.js** - Not yet created
- ⚠️ **config/match.js** - Not yet created
- ⚠️ **config/alert.js** - Not yet created (2491 lines in original)
- ⚠️ **config/index.js** - Not yet created (3754 lines in original)

## Migration Patterns

### From Vuex to Pinia

#### State Access
```javascript
// Vuex
this.$store.state.ui.sidebarWidth

// Pinia
import { useUiStore } from '@/stores/ui';
const uiStore = useUiStore();
uiStore.sidebarWidth
```

#### Mutations/Actions
```javascript
// Vuex (mutation)
this.$store.commit('ui/UPDATE_SIDEBAR_WIDTH', value)

// Pinia (action)
import { useUiStore } from '@/stores/ui';
const uiStore = useUiStore();
uiStore.updateSidebarWidth(value)
```

```javascript
// Vuex (action)
this.$store.dispatch('server/fetchStatus')

// Pinia (action)
import { useServerStore } from '@/stores/server';
const serverStore = useServerStore();
serverStore.fetchStatus()
```

#### Getters
```javascript
// Vuex
this.$store.getters['metadata/fieldsForCurrentConfig']

// Pinia
import { useMetadataStore } from '@/stores/metadata';
const metadataStore = useMetadataStore();
metadataStore.fieldsForCurrentConfig(configIndex)
```

### Component Setup

For Vue 2.7 with Composition API support:

```vue
<script>
import { useUiStore } from '@/stores/ui';
import { useServerStore } from '@/stores/server';

export default {
  setup() {
    const uiStore = useUiStore();
    const serverStore = useServerStore();
    
    return {
      uiStore,
      serverStore
    };
  },
  
  computed: {
    sidebarWidth: {
      get() {
        return this.uiStore.sidebarWidth;
      },
      set(value) {
        this.uiStore.updateSidebarWidth(value);
      }
    }
  },
  
  mounted() {
    this.serverStore.fetchVersion();
    this.serverStore.fetchStatus();
  }
}
</script>
```

Or using Options API pattern:

```vue
<script>
import { mapStores } from 'pinia';
import { useUiStore } from '@/stores/ui';

export default {
  computed: {
    ...mapStores(useUiStore),
    
    sidebarWidth: {
      get() {
        return this.uiStore.sidebarWidth;
      },
      set(value) {
        this.uiStore.updateSidebarWidth(value);
      }
    }
  }
}
</script>
```

## Remaining Work

### High Priority

1. **Complete config store modules** (⚠️ LARGE TASK)
   - Create `src/stores/config/query.js` (~50 lines)
   - Create `src/stores/config/match.js` (~490 lines)
   - Create `src/stores/config/alert.js` (~2491 lines) - VERY LARGE
   - Create `src/stores/config/index.js` (~3754 lines) - VERY LARGE
   - These contain complex state management for rule configuration

2. **Update main.js**
   - Replace Vuex store import with Pinia
   - Initialize Pinia instead of Vuex
   - Update store instantiation

3. **Update App.vue**
   - Convert from `$store.state` to Pinia stores
   - Update all store dispatches and commits

### Medium Priority

4. **Update View Components** (6 files)
   - `src/views/ConfigBuilder.vue`
   - `src/views/Folder.vue`
   - `src/views/Rules.vue`
   - `src/views/RuleView.vue`
   - `src/views/Templates.vue`
   - `src/views/TemplateView.vue`

5. **Update Core Components** (20 files)
   - ESChart.vue, EventTable.vue, PraecoFormItem.vue
   - ConfigAggregation.vue, ConfigBufferTime.vue, etc. (13 config components)
   - ConfigTest.vue, ConfigCondition.vue

6. **Update Alert Components** (43 files)
   - All files in `src/components/config/alert/`
   - Pattern is consistent across all alert types

### Low Priority

7. **Update Utility Files** (4 files)
   - `src/lib/logger.js` - May import store
   - `src/lib/networkError.js` - May import store
   - `src/lib/tree.js` - May import store
   - `src/plugins/websocket.js` - WebSocket plugin integration

8. **Update Tests** (90+ files)
   - `tests/unit/setup.js` - Replace Vuex with Pinia in test setup
   - All test spec files - Update store mocks and assertions

## Store Architecture

### Store Dependencies

Some stores depend on each other:
- `configs.js` imports and calls `config` store actions for enable/disable rules
- `metadata.js` getters take parameters from `config` store
- Need to handle cross-store communication carefully

### State Persistence

The persistence plugin has been migrated:
- Old: VueUse storage plugin for Vuex
- New: VueUse storage plugin for Pinia
- Persists: `ui` store state
- Storage key: Changed from `praeco-vuex` to `praeco-pinia`
- Users will need to reconfigure their UI preferences after migration

## Testing Strategy

1. **Unit Tests**
   - Update `tests/unit/setup.js` to create Pinia instead of Vuex store
   - Update each test file to use Pinia stores
   - Run tests incrementally as components are migrated

2. **Integration Testing**
   - Test store interactions
   - Verify data persistence
   - Check cross-store communication

3. **Manual Testing**
   - Verify UI functionality
   - Test rule creation/editing
   - Verify all alert types work correctly

## Known Challenges

1. **Large Files**: The config/alert.js and config/index.js modules are very large
2. **Nested Modules**: Config store has 4 nested modules that need coordination
3. **Cross-store Communication**: Multiple stores reference each other
4. **100+ Files**: Systematic migration required across entire codebase
5. **Vue 2.7**: Limited Composition API support compared to Vue 3

## Rollback Plan

If issues arise:
1. Revert package.json changes
2. Remove `src/stores/` directory
3. Keep `src/store/` directory (original Vuex stores)
4. Run `npm install` to restore Vuex

## Next Steps

1. Complete the config store modules (largest remaining task)
2. Update main.js to use Pinia
3. Create a systematic script or tool to migrate components
4. Migrate components in batches and test incrementally
5. Update test files after components are migrated
6. Perform comprehensive testing
7. Update documentation

## Estimated Effort

- **Config stores completion**: 8-12 hours (due to size and complexity)
- **Component migration**: 16-24 hours (100+ files, mostly patterns)
- **Test migration**: 8-12 hours (90+ test files)
- **Testing and fixes**: 8-12 hours
- **Total**: 40-60 hours of development time

## References

- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue 2.7 Release](https://blog.vuejs.org/posts/vue-2-7-naruto.html)
- [Migrating from Vuex](https://pinia.vuejs.org/cookbook/migration-vuex.html)
