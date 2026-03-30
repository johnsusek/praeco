import { computed } from 'vue';
import { useStore } from '@vueblocks/vue-use-vuex';
import { useRoute } from 'vue-router/composables';

export function usePraecoFormItem() {
  const store = useStore();
  const route = useRoute();

  const hidePreconfiguredFields = computed(() => {
    return store.state.appconfig.config.hidePreconfiguredFields || [];
  });

  const type = computed(() => {
    return route.meta.type;
  });

  return {
    hidePreconfiguredFields,
    type,
  };
}
