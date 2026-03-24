import { ref, computed, getCurrentInstance, nextTick } from 'vue';

export function useConfigAlertSmsEagle(emit) {
  const { proxy } = getCurrentInstance();

  // ===== state =====
  const popSmseagleToValid = ref(true);
  const popSmseagleContactsValid = ref(true);
  const popSmseagleGroupsValid = ref(true);

  // ===== computed (Vuex) =====
  const smseagleTo = computed({
    get: () => proxy.$store.state.config.alert.smseagleTo,
    set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_TO', v)
  });

  const smseagleContacts = computed({
    get: () => proxy.$store.state.config.alert.smseagleContacts,
    set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_CONTACTS', v)
  });

  const smseagleGroups = computed({
    get: () => proxy.$store.state.config.alert.smseagleGroups,
    set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_GROUPS', v)
  });

  // ===== validate =====
  const validate = async () => {
    try {
      if (proxy.$refs.smseagleTo) {
        await validateSmseagleTo();
      }
      if (proxy.$refs.smseagleContacts) {
        await validateSmseagleContacts();
      }
      if (proxy.$refs.smseagleGroups) {
        await validateSmseagleGroups();
      }
      emit && emit('validate', true);
      return true;
    } catch {
      emit && emit('validate', false);
      return false;
    }
  };

  const validateSmseagleTo = async () => {
    if (!smseagleTo.value.length) {
      popSmseagleToValid.value = false;
      return;
    }
    try {
      popSmseagleToValid.value = await proxy.$refs.smseagleTo.validate();
    } catch {
      popSmseagleToValid.value = false;
      throw new Error();
    }
  };

  const validateSmseagleContacts = async () => {
    if (!smseagleContacts.value.length) {
      popSmseagleContactsValid.value = false;
      return;
    }
    try {
      popSmseagleContactsValid.value = await proxy.$refs.smseagleContacts.validate();
    } catch {
      popSmseagleContactsValid.value = false;
      throw new Error();
    }
  };

  const validateSmseagleGroups = async () => {
    if (!smseagleGroups.value.length) {
      popSmseagleGroupsValid.value = false;
      return;
    }
    try {
      popSmseagleGroupsValid.value = await proxy.$refs.smseagleGroups.validate();
    } catch {
      popSmseagleGroupsValid.value = false;
      throw new Error();
    }
  };

  // ===== CRUD =====
  const updateSmseagleTo = (entry, index) => {
    if (Number.isNaN(entry)) return;
    proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_TO_ENTRY', { entry, index });
    nextTick(validate);
  };

  const removeSmseagleToEntry = (entry) => {
    proxy.$store.commit('config/alert/REMOVE_SMSEAGLE_TO_ENTRY', entry);
    nextTick(validate);
  };

  const addSmseagleToEntry = () => {
    proxy.$store.commit('config/alert/ADD_SMSEAGLE_TO_ENTRY');
    nextTick(validate);
  };

  // ===== return =====
  return {
    smseagleTo,
    smseagleContacts,
    smseagleGroups,

    popSmseagleToValid,
    popSmseagleContactsValid,
    popSmseagleGroupsValid,

    validate,

    updateSmseagleTo,
    removeSmseagleToEntry,
    addSmseagleToEntry
  };
}
