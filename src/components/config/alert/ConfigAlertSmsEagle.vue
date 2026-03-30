<template>
  <div>
    <el-form-item label="smseagle_url" prop="smseagleUrl" required>
      <el-input id="smseagleUrl" :value="smseagleUrl" :disabled="viewOnly" />
    </el-form-item>

    <el-form-item label="smseagle_token" prop="smseagleToken" required>
      <el-input id="smseagleToken" :value="smseagleToken" :disabled="viewOnly" />
    </el-form-item>

    <el-form-item label="smseagle_message_type" prop="smseagleMessageType" required>
      <el-radio-group :value="smseagleMessageType" :disabled="viewOnly">
        <el-radio id="smseagleMessageTypeSms" label="sms">
          sms
        </el-radio>
        <el-radio id="smseagleMessageTypeRing" label="ring">
          ring
        </el-radio>
        <el-radio id="smseagleMessageTypeTts" label="tts">
          tts
        </el-radio>
        <el-radio id="smseagleMessageTypeTtsAdv" label="tts_adv">
          tts_adv
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="smseagle_text" prop="smseagleText">
      <el-input id="smseagleText" :value="smseagleText" :disabled="viewOnly" />
    </el-form-item>

    <el-popover v-model="popSmseagleToVisible" :destroy-on-close="true" :class="{ 'is-invalid': !popSmseagleToValid }">
      <template #reference>
        <span class="pop-trigger">
          <el-tooltip v-if="smseagleTo.length" :content="smseagleTo.join(', ')" placement="top">
            <span>SmseagleTos ({{ smseagleTo.length }})</span>
          </el-tooltip>
          <span v-else>SmseagleTos ({{ smseagleTo.length }})</span>
        </span>
      </template>
      <div>
        <el-form
          ref="smseagleTo"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in smseagleTo"
            :key="index"
            :prop="`smseagleTo.${index}`"
            :disabled="viewOnly"
            class="el-form-item-list"
            label="">
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  :value="smseagleTo[index]"
                  :disabled="viewOnly"
                  placeholder="SmseagleTos" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removeSmseagleToEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addSmseagleToEntry">
          Add smseagle_to
        </el-button>
      </div>
    </el-popover>

    <el-popover v-model="popSmseagleContactsVisible" :destroy-on-close="true" :class="{ 'is-invalid': !popSmseagleContactsValid }">
      <template #reference>
        <span class="pop-trigger">
          <el-tooltip v-if="smseagleContacts.length" :content="smseagleContacts.join(', ')" placement="top">
            <span>SmseagleContacts ({{ smseagleContacts.length }})</span>
          </el-tooltip>
          <span v-else>SmseagleContacts ({{ smseagleContacts.length }})</span>
        </span>
      </template>
      <div>
        <el-form
          ref="smseagleContacts"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in smseagleContacts"
            :key="index"
            :prop="`smseagleContacts.${index}`"
            :disabled="viewOnly"
            class="el-form-item-list"
            label="">
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input-number
                  :value="smseagleContacts[index]"
                  :disabled="viewOnly"
                  placeholder="SmseagleContacts" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removeSmseagleContactsEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addSmseagleContactsEntry">
          Add smseagle_contacts
        </el-button>
      </div>
    </el-popover>

    <el-popover v-model="popSmseagleGroupsVisible" :destroy-on-close="true" :class="{ 'is-invalid': !popSmseagleGroupsValid }">
      <template #reference>
        <span class="pop-trigger">
          <el-tooltip v-if="smseagleGroups.length" :content="smseagleGroups.join(', ')" placement="top">
            <span>SmseagleGroups ({{ smseagleGroups.length }})</span>
          </el-tooltip>
          <span v-else>SmseagleGroups ({{ smseagleGroups.length }})</span>
        </span>
      </template>
      <div>
        <el-form
          ref="smseagleGroups"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in smseagleGroups"
            :key="index"
            :prop="`smseagleGroups.${index}`"
            :disabled="viewOnly"
            class="el-form-item-list"
            label="">
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input-number
                  :value="smseagleGroups[index]"
                  :disabled="viewOnly"
                  placeholder="SmseagleGroups" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removeSmseagleGroupsEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addSmseagleGroupsEntry">
          Add smseagle_groups
        </el-button>
      </div>
    </el-popover>

    <el-form-item label="smseagle_duration" :destroy-on-close="true" prop="smseagleDuration">
      <el-input-number id="smseagleDuration" :value="smseagleDuration" :disabled="viewOnly" />
    </el-form-item>

    <el-form-item label="smseagle_voice_id" prop="smseagleVoiceId">
      <el-input-number id="smseagleVoiceId" :value="smseagleVoiceId" :disabled="viewOnly" />
    </el-form-item>
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance, watchEffect } from 'vue';

export default {
  props: ['viewOnly'],

  setup() {
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
      get: () => proxy.$store.state.config.alert.smseagleUrl || '',
      set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_URL', v)
    });

    const smseagleToken = computed({
      get: () => proxy.$store.state.config.alert.smseagleToken || '',
      set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_TOKEN', v)
    });

    const smseagleMessageType = computed({
      get: () => proxy.$store.state.config.alert.smseagleMessageType || '',
      set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_MESSAGE_TYPE', v)
    });

    const smseagleText = computed({
      get: () => proxy.$store.state.config.alert.smseagleText || '',
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
      get: () => proxy.$store.state.config.alert.smseagleDuration || '',
      set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_DURATION', v)
    });

    const smseagleVoiceId = computed({
      get: () => proxy.$store.state.config.alert.smseagleVoiceId || '',
      set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_VOICE_ID', v)
    });

    // ===== methods =====
    const updateSmseagleTo = (entry, index) => {
      if (Number.isNaN(entry)) return;
      proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_TO_ENTRY', { entry, index });

    };

    const removeSmseagleToEntry = (entry) => {
      proxy.$store.commit('config/alert/REMOVE_SMSEAGLE_TO_ENTRY', entry);

    };

    const addSmseagleToEntry = () => {
      proxy.$store.commit('config/alert/ADD_SMSEAGLE_TO_ENTRY');

    };

    // --- Contacts ---

    const updateSmseagleContacts = (entry, index) => {
      if (Number.isNaN(entry)) return;
      proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_CONTACTS_ENTRY', { entry, index });
    };

    const removeSmseagleContactsEntry = (entry) => {
      proxy.$store.commit('config/alert/REMOVE_SMSEAGLE_CONTACTS_ENTRY', entry);
    };

    const addSmseagleContactsEntry = () => {
      proxy.$store.commit('config/alert/ADD_SMSEAGLE_CONTACTS_ENTRY');
    };

    // --- Groups ---
    const updateSmseagleGroups = (entry, index) => {
      if (Number.isNaN(entry)) return;
      proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_GROUPS_ENTRY', { entry, index });
    };

    const removeSmseagleGroupsEntry = (entry) => {
      proxy.$store.commit('config/alert/REMOVE_SMSEAGLE_GROUPS_ENTRY', entry);
    };

    const addSmseagleGroupsEntry = () => {
      proxy.$store.commit('config/alert/ADD_SMSEAGLE_GROUPS_ENTRY');
    };

    watchEffect(() => {
      console.log(smseagleUrl.value);
      console.log('URL型:', typeof smseagleUrl.value, smseagleUrl.value);
    });

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
};
</script>

  <style lang="scss" scoped>
  </style>
