<template>
  <div>
    <el-form-item label="smseagle_url" prop="smseagleUrl" required>
      <el-input id="smseagleUrl" :value="smseagleUrl" :disabled="viewOnly" @input="smseagleUrl = $event" />
    </el-form-item>

    <el-form-item label="smseagle_token" prop="smseagleToken" required>
      <el-input id="smseagleToken" :value="smseagleToken" :disabled="viewOnly" @input="smseagleToken = $event" />
    </el-form-item>

    <el-form-item label="smseagle_message_type" prop="smseagleMessageType" required>
      <el-radio-group :value="smseagleMessageType" :disabled="viewOnly" @input="smseagleMessageType = $event">
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
      <el-input id="smseagleText" :value="smseagleText" :disabled="viewOnly" @input="smseagleText = $event" />
    </el-form-item>

    <el-popover v-model="popSmseagleToVisible" :class="{ 'is-invalid': !popSmseagleToValid }">
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
                  v-model="smseagleTo[index]"
                  :disabled="viewOnly"
                  placeholder="SmseagleTos"
                  @input="(val) => updateSmseagleTo(val, index)" />
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

    <el-popover v-model="popSmseagleContactsVisible" :class="{ 'is-invalid': !popSmseagleContactsValid }">
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
                  v-model="smseagleContacts[index]"
                  :disabled="viewOnly"
                  placeholder="SmseagleContacts"
                  @input="(val) => updateSmseagleContacts(val, index)" />
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

    <el-popover v-model="popSmseagleGroupsVisible" :class="{ 'is-invalid': !popSmseagleGroupsValid }">
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
                  v-model="smseagleGroups[index]"
                  :disabled="viewOnly"
                  placeholder="SmseagleGroups"
                  @input="(val) => updateSmseagleGroups(val, index)" />
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
      <el-input-number id="smseagleDuration" :value="smseagleDuration" :disabled="viewOnly" @input="smseagleDuration = $event" />
    </el-form-item>

    <el-form-item label="smseagle_voice_id" prop="smseagleVoiceId">
      <el-input-number id="smseagleVoiceId" :value="smseagleVoiceId" :disabled="viewOnly" @input="smseagleVoiceId = $event" />
    </el-form-item>
  </div>
</template>

<script>
import { useConfigAlertSmsEagle } from '@/composables/useConfigAlertSmsEagle';

export default {
  props: ['viewOnly'],
  emits: ['validate'],

  setup(props, { emit }) {
    const smseagle = useConfigAlertSmsEagle(emit);

    return {
      ...smseagle
    };
  }
};
</script>

  <style lang="scss" scoped>
  </style>
