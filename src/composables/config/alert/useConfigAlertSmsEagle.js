import { ref, computed, getCurrentInstance, nextTick } from 'vue';

export function useConfigAlertSmsEagle(emit) {
  const { proxy } = getCurrentInstance();

  // ===== state =====
  const popSmseagleToVisible = ref(false);
  const popSmseagleToValid = ref(true);

  const popSmseagleContactsVisible = ref(false);
  const popSmseagleContactsValid = ref(true);

  const popSmseagleGroupsVisible = ref(false);
  const popSmseagleGroupsValid = ref(true);

  // ===== computed (Vuex) =====
  const smseagleUrl = computed({
    get: () => proxy.$store.state.config.alert.smseagleUrl,
    set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_URL', v)
  });

  const smseagleToken = computed({
    get: () => proxy.$store.state.config.alert.smseagleToken,
    set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_TOKEN', v)
  });

  const smseagleMessageType = computed({
    get: () => proxy.$store.state.config.alert.smseagleMessageType,
    set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_MESSAGE_TYPE', v)
  });

  const smseagleText = computed({
    get: () => proxy.$store.state.config.alert.smseagleText,
    set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_TEXT', v)
  });

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

  const smseagleDuration = computed({
    get: () => proxy.$store.state.config.alert.smseagleDuration,
    set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_DURATION', v)
  });

  const smseagleVoiceId = computed({
    get: () => proxy.$store.state.config.alert.smseagleVoiceId,
    set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_VOICE_ID', v)
  });

  // ===== methods =====
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
      emit('validate', true);
      return true;
    } catch {
      emit('validate', false);
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

  // --- Contacts ---
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

  const updateSmseagleContacts = (entry, index) => {
    if (Number.isNaN(entry)) return;
    proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_CONTACTS_ENTRY', { entry, index });
    nextTick(validate);
  };

  const removeSmseagleContactsEntry = (entry) => {
    proxy.$store.commit('config/alert/REMOVE_SMSEAGLE_CONTACTS_ENTRY', entry);
    nextTick(validate);
  };

  const addSmseagleContactsEntry = () => {
    proxy.$store.commit('config/alert/ADD_SMSEAGLE_CONTACTS_ENTRY');
    nextTick(validate);
  };

  // --- Groups ---
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

  const updateSmseagleGroups = (entry, index) => {
    if (Number.isNaN(entry)) return;
    proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_GROUPS_ENTRY', { entry, index });
    nextTick(validate);
  };

  const removeSmseagleGroupsEntry = (entry) => {
    proxy.$store.commit('config/alert/REMOVE_SMSEAGLE_GROUPS_ENTRY', entry);
    nextTick(validate);
  };

  const addSmseagleGroupsEntry = () => {
    proxy.$store.commit('config/alert/ADD_SMSEAGLE_GROUPS_ENTRY');
    nextTick(validate);
  };

  return {
    // state
    popSmseagleToVisible,
    popSmseagleToValid,
    popSmseagleContactsVisible,
    popSmseagleContactsValid,
    popSmseagleGroupsVisible,
    popSmseagleGroupsValid,

    // computed
    smseagleUrl,
    smseagleToken,
    smseagleMessageType,
    smseagleText,
    smseagleTo,
    smseagleContacts,
    smseagleGroups,
    smseagleDuration,
    smseagleVoiceId,

    // methods
    validate,
    updateSmseagleTo,
    removeSmseagleToEntry,
    addSmseagleToEntry,
    updateSmseagleContacts,
    removeSmseagleContactsEntry,
    addSmseagleContactsEntry,
    updateSmseagleGroups,
    removeSmseagleGroupsEntry,
    addSmseagleGroupsEntry
  };
}
