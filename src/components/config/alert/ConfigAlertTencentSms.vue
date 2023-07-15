<template>
  <div>
    <praeco-form-item label="Secret ID" prop="tencentSmsSecretId" required>
      <el-input id="tencentSmsSecretId" v-model="tencentSmsSecretId" :disabled="viewOnly" />
      <label>is used to identify the API caller.</label>
    </praeco-form-item>

    <praeco-form-item label="Secret Key" prop="tencentSmsSecretKey" required>
      <el-input id="tencentSmsSecretKey" v-model="tencentSmsSecretKey" :disabled="viewOnly" />
      <label>
        is used to encrypt the string to sign that can be verified on the server.
        You should keep it private and avoid disclosure.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Sdk Appid" prop="tencentSmsSdkAppid" required>
      <el-input id="tencentSmsSdkAppid" v-model="tencentSmsSdkAppid" :disabled="viewOnly" />
      <label>SMS application ID, which is the SdkAppId generated after an application is added in the SMS console.</label>
    </praeco-form-item>

    <el-popover v-model="popTencentSmsToNumberVisible" :class="{ 'is-invalid': !popTencentSmsToNumberValid }">
      <template #reference>
        <span class="pop-trigger">
          <el-tooltip v-if="tencentSmsToNumber.length" :content="tencentSmsToNumber.join(', ')" placement="top">
            <span>TencentSmsToNumber ({{ tencentSmsToNumber.length }})</span>
          </el-tooltip>
          <span v-else>TencentSmsToNumber ({{ tencentSmsToNumber.length }})</span>
        </span>
      </template>
      <template>
        <el-form
          ref="tencentSmsToNumber"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          required
          @submit.prevent>
          <el-form-item
            v-for="(entry, index) in tencentSmsToNumber"
            :key="index"
            :prop="'tencentSmsToNumber.' + index"
            :disabled="viewOnly"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="tencentSmsToNumber[index]"
                  :disabled="viewOnly"
                  placeholder="TencentSmsToNumber"
                  @input="(val) => updateTencentSmsToNumber(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  :icon="ElIconDelete"
                  circle
                  plain
                  @click="removeTencentSmsToNumberEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addTencentSmsToNumberEntry">
          Add target mobile number
        </el-button>
      </template>
    </el-popover>

    <praeco-form-item label="TemplateId" prop="tencentSmsTemplateId" required>
      <el-input id="tencentSmsTemplateId" v-model="tencentSmsTemplateId" :disabled="viewOnly" />
      <label>
        Template ID.
        You must enter the ID of an approved template, which can be viewed in the SMS console.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Sign Name" prop="tencentSmsSignName">
      <el-input id="tencentSmsSignName" v-model="tencentSmsSignName" :disabled="viewOnly" />
      <label>
        Content of the SMS signature, which should be encoded in UTF-8.
        You must enter an approved signature, such as Tencent Cloud.
        The signature information can be viewed in the SMS console. Note: this parameter is required for Mainland China SMS.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Region" prop="tencentSmsRegion">
      <el-input id="tencentSmsSdkAppid" v-model="tencentSmsRegion" :disabled="viewOnly" />
      <label>Region parameter, which is used to identify the region(Mainland China or Global) to which the data you want to work with belongs.</label>
    </praeco-form-item>

    <!-- tencentSmsTemplateParm -->
    <el-popover v-model="popTencentSmsTemplateParmVisible" :class="{ 'is-invalid': !popTencentSmsTemplateParmValid }">
      <template #reference>
        <span class="pop-trigger">
          <el-tooltip v-if="tencentSmsTemplateParm.length" :content="tencentSmsTemplateParm.join(', ')" placement="top">
            <span>TencentSmsTemplateParm ({{ tencentSmsTemplateParm.length }})</span>
          </el-tooltip>
          <span v-else>TencentSmsTemplateParm ({{ tencentSmsTemplateParm.length }})</span>
        </span>
      </template>
      <template>
        <el-form
          ref="tencentSmsTemplateParm"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.prevent>
          <el-form-item
            v-for="(entry, index) in tencentSmsTemplateParm"
            :key="index"
            :prop="'tencentSmsTemplateParm.' + index"
            :disabled="viewOnly"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="tencentSmsTemplateParm[index]"
                  :disabled="viewOnly"
                  placeholder="TencentSmsTemplateParm"
                  @input="(val) => updateTencentSmsTemplateParm(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  :icon="ElIconDelete"
                  circle
                  plain
                  @click="removeTencentSmsTemplateParmEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addTencentSmsTemplateParmEntry">
          Add template parm
        </el-button>
      </template>
    </el-popover>
  </div>
</template>

<script>
import { Delete as ElIconDelete } from '@element-plus/icons-vue';

export default {
  props: ['viewOnly'],
  emits: ['validate'],

  data() {
    return {
      popTencentSmsToNumberVisible: false,
      popTencentSmsToNumberValid: true,
      popTencentSmsTemplateParmVisible: false,
      popTencentSmsTemplateParmValid: true,
      ElIconDelete,
    };
  },

  computed: {
    tencentSmsSecretId: {
      get() {
        return this.$store.state.config.alert.tencentSmsSecretId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TENCENT_SMS_SECRET_ID',
          value
        );
      }
    },

    tencentSmsSecretKey: {
      get() {
        return this.$store.state.config.alert.tencentSmsSecretKey;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TENCENT_SMS_SECRET_KEY',
          value
        );
      }
    },

    tencentSmsSdkAppid: {
      get() {
        return this.$store.state.config.alert.tencentSmsSdkAppid;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TENCENT_SMS_SDK_APPID',
          value
        );
      }
    },

    tencentSmsToNumber: {
      get() {
        return this.$store.state.config.alert.tencentSmsToNumber;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TENCENT_SMS_TO_NUMBER',
          value
        );
      }
    },

    tencentSmsRegion: {
      get() {
        return this.$store.state.config.alert.tencentSmsRegion;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TENCENT_SMS_REGION',
          value
        );
      }
    },

    tencentSmsSignName: {
      get() {
        return this.$store.state.config.alert.tencentSmsSignName;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TENCENT_SMS_SIGN_NAME',
          value
        );
      }
    },

    tencentSmsTemplateId: {
      get() {
        return this.$store.state.config.alert.tencentSmsTemplateId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TENCENT_SMS_TEMPLATE_ID',
          value
        );
      }
    },

    tencentSmsTemplateParm: {
      get() {
        return this.$store.state.config.alert.tencentSmsTemplateParm;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_TENCENT_SMS_TEMPLATE_PARM',
          value
        );
      }
    }
  },

  methods: {
    async validate() {
      try {
        if (this.$refs.tencentSmsToNumber) {
          await this.validateTencentSmsToNumber();
        }
        if (this.$refs.tencentSmsTemplateParm) {
          await this.validateTencentSmsTemplateParm();
        }
        this.$emit('validate', true);
        return true;
      } catch (error) {
        this.$emit('validate', false);
        return false;
      }
    },

    /* tencentSmsToNumber */
    async validateTencentSmsToNumber() {
      if (!this.tencentSmsToNumber.length) {
        this.popTencentSmsToNumberValid = false;
        return;
      }
      try {
        this.popTencentSmsToNumberValid = await this.$refs.tencentSmsToNumber.validate();
      } catch (error) {
        this.popTencentSmsToNumberValid = false;
        throw error;
      }
    },

    updateTencentSmsToNumber(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_TENCENT_SMS_TO_NUMBER_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removeTencentSmsToNumberEntry(entry) {
      this.$store.commit('config/alert/REMOVE_TENCENT_SMS_TO_NUMBER_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addTencentSmsToNumberEntry() {
      this.$store.commit('config/alert/ADD_TENCENT_SMS_TO_NUMBER_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    /* tencentSmsTemplateParm */
    async validateTencentSmsTemplateParm() {
      if (!this.tencentSmsTemplateParm.length) {
        this.popTencentSmsTemplateParmValid = false;
        return;
      }
      try {
        this.popTencentSmsTemplateParmValid = await this.$refs.tencentSmsTemplateParm.validate();
      } catch (error) {
        this.popTencentSmsTemplateParmValid = false;
        throw error;
      }
    },

    updateTencentSmsTemplateParm(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_TENCENT_SMS_TEMPLATE_PARM_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removeTencentSmsTemplateParmEntry(entry) {
      this.$store.commit('config/alert/REMOVE_TENCENT_SMS_TEMPLATE_PARM_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addTencentSmsTemplateParmEntry() {
      this.$store.commit('config/alert/ADD_TENCENT_SMS_TEMPLATE_PARM_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    }
  }
};
</script>

<style lang="scss">
</style>
