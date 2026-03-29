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
