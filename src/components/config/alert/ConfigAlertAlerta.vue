<template>
  <div>
    <el-form-item label="API URL" prop="alertaApiUrl" required>
      <el-input id="alertaApiUrl" v-model="alertaApiUrl" :disabled="viewOnly" />
      <label>API server URL.</label>
    </el-form-item>

    <el-form-item label="API Key" prop="alertaApiKey">
      <el-input id="alertaApiKey" v-model="alertaApiKey" :disabled="viewOnly" />
      <label>
        This is the api key for alerta server, sent in an Authorization HTTP header.
        If not defined, no Authorization header is sent.
      </label>
    </el-form-item>

    <el-form-item label="Severity" prop="alertaSeverity">
      <el-select
        v-model="alertaSeverity"
        :disabled="viewOnly"
        placeholder=""
        class="el-select-wide">
        <el-option
          v-for="v in alertaSeverityOptions"
          :key="v.code"
          :label="v.name"
          :value="v.code" />
      </el-select>
    </el-form-item>

    <el-form-item label="Resource" prop="alertaResource">
      <el-input id="alertaResource" v-model="alertaResource" :disabled="viewOnly" />
      <label>If true and query_key is present, this will override alerta_resource field with the query_key value (Can be useful if query_key is a hostname).</label>
    </el-form-item>

    <el-form-item label="Text" prop="alertaText">
      <el-input id="alertaText" v-model="alertaText" :disabled="viewOnly" />
      <label>
        This is the api key for alerta server, sent in an Authorization HTTP header.
        If not defined, no Authorization header is sent.
      </label>
    </el-form-item>

    <el-form-item label="Event" prop="alertaEvent">
      <el-input id="alertaEvent" v-model="alertaEvent" :disabled="viewOnly" />
      <label>Defaults to “elastalert”.</label>
    </el-form-item>

    <el-form-item label="Group" prop="alertaGroup">
      <el-input id="alertaGroup" v-model="alertaGroup" :disabled="viewOnly" />
      <label>Defaults to “”.</label>
    </el-form-item>

    <el-popover v-model="popAlertaTagsVisible" :class="{ 'is-invalid': !popAlertaTagsValid }">
      <template #reference>
        <span class="pop-trigger">
          <el-tooltip v-if="alertaTags.length" :content="alertaTags.join(', ')" placement="top">
            <span>Tags ({{ alertaTags.length }})</span>
          </el-tooltip>
          <span v-else>Tags ({{ alertaTags.length }})</span>
        </span>
      </template>
      <template>
        <el-form
          ref="alertaTags"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.prevent>
          <el-form-item
            v-for="(entry, index) in alertaTags"
            :key="index"
            :prop="'alertaTags.' + index"
            :disabled="viewOnly"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="alertaTags[index]"
                  :disabled="viewOnly"
                  placeholder="Tags"
                  @input="(val) => updateAlertaTags(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  :icon="ElIconDelete"
                  circle
                  plain
                  @click="removeAlertaTagsEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addAlertaTagsEntry">
          Add tags
        </el-button>
      </template>
    </el-popover>

    <el-form-item label="Environment" prop="alertaEnvironment">
      <el-input id="alertaEnvironment" v-model="alertaEnvironment" :disabled="viewOnly" />
      <label>Defaults to “Production”.</label>
    </el-form-item>
  </div>
</template>

<script>
import { Delete as ElIconDelete } from '@element-plus/icons-vue';

export default {
  props: ['viewOnly'],
  emits: ['validate'],

  data() {
    return {
      popAlertaTagsVisible: false,
      popAlertaTagsValid: true,
      alertaSeverityOptions: [{
        code: 'unknown',
        name: 'unknown'
      }, {
        code: 'security',
        name: 'security'
      }, {
        code: 'debug',
        name: 'debug'
      }, {
        code: 'informational',
        name: 'informational'
      }, {
        code: 'ok',
        name: 'ok'
      }, {
        code: 'normal',
        name: 'normal'
      }, {
        code: 'cleared',
        name: 'cleared'
      }, {
        code: 'indeterminate',
        name: 'indeterminate'
      }, {
        code: 'warning',
        name: 'warning'
      }, {
        code: 'minor',
        name: 'minor'
      }, {
        code: 'major',
        name: 'major'
      }, {
        code: 'critical',
        name: 'critical'
      }],
      ElIconDelete,
    };
  },

  computed: {
    alertaApiUrl: {
      get() {
        return this.$store.state.config.alert.alertaApiUrl;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_API_URL', value);
      }
    },

    alertaApiKey: {
      get() {
        return this.$store.state.config.alert.alertaApiKey;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_API_KEY', value);
      }
    },

    alertaSeverity: {
      get() {
        return this.$store.state.config.alert.alertaSeverity;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_SEVERITY', value);
      }
    },

    alertaResource: {
      get() {
        return this.$store.state.config.alert.alertaResource;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_RESOURCE', value);
      }
    },

    alertaText: {
      get() {
        return this.$store.state.config.alert.alertaText;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_TEXT', value);
      }
    },

    alertaEvent: {
      get() {
        return this.$store.state.config.alert.alertaEvent;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_EVENT', value);
      }
    },

    alertaGroup: {
      get() {
        return this.$store.state.config.alert.alertaGroup;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_GROUP', value);
      }
    },

    alertaTags: {
      get() {
        return this.$store.state.config.alert.alertaTags;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_TAGS', value);
      }
    },

    alertaEnvironment: {
      get() {
        return this.$store.state.config.alert.alertaEnvironment;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_ENVIRONMENT', value);
      }
    }
  },

  methods: {
    async validate() {
      try {
        if (this.$refs.alertaTags) {
          await this.validateAlertaTags();
        }
        this.$emit('validate', true);
        return true;
      } catch (error) {
        this.$emit('validate', false);
        return false;
      }
    },

    async validateAlertaTags() {
      if (!this.alertaTags.length) {
        this.popAlertaTagsValid = false;
        return;
      }
      try {
        this.popAlertaTagsValid = await this.$refs.alertaTags.validate();
      } catch (error) {
        this.popAlertaTagsValid = false;
        throw error;
      }
    },

    updateAlertaTags(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_ALERTA_TAGS_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removeAlertaTagsEntry(entry) {
      this.$store.commit('config/alert/REMOVE_ALERTA_TAGS_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addAlertaTagsEntry() {
      this.$store.commit('config/alert/ADD_ALERTA_TAGS_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    }
  }
};
</script>

<style lang="scss">

</style>
