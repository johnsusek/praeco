<template>
  <div>
    <el-form-item label="smseagle_url" prop="smseagleUrl" required>
      <el-input v-model="smseagleUrl" :disabled="viewOnly" />
    </el-form-item>

    <el-form-item label="smseagle_token" prop="smseagleToken" required>
      <el-input v-model="smseagleToken" :disabled="viewOnly" />
    </el-form-item>

    <el-form-item label="smseagle_message_type" prop="smseagleMessageType" required>
      <el-radio-group v-model="smseagleMessageType" :disabled="viewOnly">
        <el-radio label="sms">
          sms
        </el-radio>
        <el-radio label="ring">
          ring
        </el-radio>
        <el-radio label="tts">
          tts
        </el-radio>
        <el-radio label="tts_adv">
          tts_adv
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="smseagle_text" prop="smseagleText">
      <el-input v-model="smseagleText" :disabled="viewOnly" />
    </el-form-item>

    <el-popover v-model="popSmseagleToVisible" :class="{ 'is-invalid': !popSmseagleToValid }" @hide="saveSmseagleTo">
      <template #reference>
        <span class="pop-trigger">
          <el-tooltip v-if="smseagleTo.length" :content="safeSmseagleTo" placement="top">
            <span>SmseagleTos ({{ smseagleTo.length }})</span>
          </el-tooltip>
          <span v-else>SmseagleTos ({{ smseagleTo.length }})</span>
        </span>
      </template>
      <div>
        <el-form
          ref="smseagleTo"
          :model="{ smseagleTo }"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in localSmseagleTo"
            :key="index"
            :prop="`${index}`"
            :disabled="viewOnly"
            class="el-form-item-list"
            label="">
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="localSmseagleTo[index]"
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
                  @click="removeSmseagleToEntry(index)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addSmseagleToEntry">
          Add smseagle_to
        </el-button>
      </div>
    </el-popover>

    <el-popover v-model="popSmseagleContactsVisible" :class="{ 'is-invalid': !popSmseagleContactsValid }" @hide="saveSmseagleContacts">
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
          :model="{ smseagleContacts }"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in localSmseagleContacts"
            :key="index"
            :prop="`${index}`"
            :disabled="viewOnly"
            class="el-form-item-list"
            label="">
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input-number
                  v-model="localSmseagleContacts[index]"
                  :value="entry"
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

    <el-popover v-model="popSmseagleGroupsVisible" :class="{ 'is-invalid': !popSmseagleGroupsValid }" @hide="saveSmseagleGroups">
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
          :model="{ smseagleGroups }"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in localSmseagleGroups"
            :key="index"
            :prop="`${index}`"
            :disabled="viewOnly"
            class="el-form-item-list"
            label="">
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input-number
                  v-model="localSmseagleGroups[index]"
                  :value="entry"
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

    <el-form-item label="smseagle_duration" prop="smseagleDuration">
      <el-input-number v-model="smseagleDuration" :disabled="viewOnly" />
    </el-form-item>

    <el-form-item label="smseagle_voice_id" prop="smseagleVoiceId">
      <el-input-number v-model="smseagleVoiceId" :disabled="viewOnly" />
    </el-form-item>
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance, watch, onMounted } from 'vue';

export default {
  props: ['viewOnly'],

  setup() {
    const { proxy } = getCurrentInstance();

    const localSmseagleTo = ref([]);
    const localSmseagleContacts = ref([]);
    const localSmseagleGroups = ref([]);

    // ===== state =====
    const popSmseagleToVisible = ref(false);
    const popSmseagleToValid = ref(true);

    const popSmseagleContactsVisible = ref(false);
    const popSmseagleContactsValid = ref(true);

    const popSmseagleGroupsVisible = ref(false);
    const popSmseagleGroupsValid = ref(true);

    // ===== smseagleUrl =====
    const smseagleUrl = computed({
      get: () => proxy.$store.state.config.alert.smseagleUrl || '',
      set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_URL', v)
    });

    // ===== smseagleToken =====
    const smseagleToken = computed({
      get: () => proxy.$store.state.config.alert.smseagleToken || '',
      set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_TOKEN', v)
    });

    // ===== smseagleMessageType =====
    const smseagleMessageType = computed({
      get: () => proxy.$store.state.config.alert.smseagleMessageType || '',
      set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_MESSAGE_TYPE', v)
    });

    // ===== smseagleText =====
    const smseagleText = computed({
      get: () => proxy.$store.state.config.alert.smseagleText || '',
      set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_TEXT', v)
    });

    // ===== smseagleTo =====
    const smseagleTo = computed({
      get: () =>
        Array.isArray(proxy.$store.state.config.alert.smseagleTo)
          ? proxy.$store.state.config.alert.smseagleTo
          : [],
      set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_TO', v)
    });

    const safeSmseagleTo = computed(() => {
      const arr = Array.isArray(smseagleTo.value)
        ? smseagleTo.value
        : [];

      return arr
        .filter(v => ['string', 'number'].includes(typeof v))
        .join(', ');
    });

    const addSmseagleToEntry = () => {
      localSmseagleTo.value.push('');
    };

    const removeSmseagleToEntry = index => {
      localSmseagleTo.value.splice(index, 1);
    };

    const saveSmseagleTo = () => {
      proxy.$store.commit(
        'config/alert/UPDATE_SMSEAGLE_TO',
        [...localSmseagleTo.value]
      );
    };

    // ===== smseagleContacts =====
    const smseagleContacts = computed({
      get: () => proxy.$store.state.config.alert.smseagleContacts || [],
      set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_CONTACTS', v)
    });

    const addSmseagleContactsEntry = () => {
      localSmseagleContacts.value.push('');
    };

    const removeSmseagleContactsEntry = index => {
      localSmseagleContacts.value.splice(index, 1);
    };

    const saveSmseagleContacts = () => {
      proxy.$store.commit(
        'config/alert/UPDATE_SMSEAGLE_CONTACTS',
        [...localSmseagleContacts.value]
      );
    };

    const safeSmseagleContacts = computed(() => {
      const arr = Array.isArray(smseagleContacts.value)
        ? smseagleContacts.value
        : [];

      return arr
        .filter(v => ['string', 'number'].includes(typeof v))
        .join(', ');
    });

    // ===== smseagleGroups =====
    const smseagleGroups = computed({
      get: () => proxy.$store.state.config.alert.smseagleGroups || [],
      set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_GROUPS', v)
    });

    const addSmseagleGroupsEntry = () => {
      localSmseagleGroups.value.push('');
    };

    const removeSmseagleGroupsEntry = index => {
      localSmseagleGroups.value.splice(index, 1);
    };

    const safeSmseagleGroups = computed(() => {
      const arr = Array.isArray(smseagleGroups.value)
        ? smseagleGroups.value
        : [];

      return arr
        .filter(v => ['string', 'number'].includes(typeof v))
        .join(', ');
    });

    const saveSmseagleGroups = () => {
      proxy.$store.commit(
        'config/alert/UPDATE_SMSEAGLE_GROUPS',
        [...localSmseagleGroups.value]
      );
    };

    // ===== smseagleDuration =====
    const smseagleDuration = computed({
      get: () => proxy.$store.state.config.alert.smseagleDuration || '',
      set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_DURATION', v)
    });

    // ===== smseagleVoiceId =====
    const smseagleVoiceId = computed({
      get: () => proxy.$store.state.config.alert.smseagleVoiceId || '',
      set: v => proxy.$store.commit('config/alert/UPDATE_SMSEAGLE_VOICE_ID', v)
    });

    // ===== methods =====
    onMounted(() => {
      localSmseagleTo.value = [...smseagleTo.value];
    });

    watch(popSmseagleToVisible, visible => {
      if (visible) {
        localSmseagleTo.value = [...smseagleTo.value];
      }
    });

    //console.log(
    //  smseagleTo.value.map(v => ({
    //    value: v,
    //    type: typeof v,
    //    isArray: Array.isArray(v)
    //  }))
    //);

    return {
      smseagleUrl,
      smseagleToken,
      smseagleMessageType,
      smseagleText,

      smseagleTo,
      localSmseagleTo,
      safeSmseagleTo,

      smseagleContacts,
      localSmseagleContacts,
      safeSmseagleContacts,

      smseagleGroups,
      localSmseagleGroups,
      safeSmseagleGroups,

      smseagleDuration,
      smseagleVoiceId,

      popSmseagleToVisible,
      popSmseagleToValid,
      popSmseagleContactsVisible,
      popSmseagleContactsValid,
      popSmseagleGroupsVisible,
      popSmseagleGroupsValid,

      saveSmseagleTo,
      saveSmseagleContacts,
      saveSmseagleGroups,

      removeSmseagleToEntry,
      addSmseagleToEntry,

      removeSmseagleContactsEntry,
      addSmseagleContactsEntry,

      removeSmseagleGroupsEntry,
      addSmseagleGroupsEntry
    };
  }
};
</script>
