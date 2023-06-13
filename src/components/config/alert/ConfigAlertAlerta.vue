<template>
  <div>
    <el-form-item label="API URL" prop="alertaApiUrl">
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
      <template v-slot:reference>
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
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in alertaTags"
            :key="index"
            :prop="'alertaTags.' + index"
            :disabled="viewOnly"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5" type="flex" justify="space-between">
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
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removeAlertaTagsEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addAlertaTagsEntry">
          Add Tags
        </el-button>
      </template>
    </el-popover>

    <el-form-item label="Environment" prop="alertaEnvironment">
      <el-input id="alertaEnvironment" v-model="alertaEnvironment" :disabled="viewOnly" />
      <label>Defaults to “Production”.</label>
    </el-form-item>

    <el-form-item label="Timeout" prop="alertaTimeout">
      <el-input-number id="alertaTimeout" v-model="alertaTimeout" :disabled="viewOnly" />
      <label>
        Defaults 84600 (1 Day).
      </label>
    </el-form-item>

    <el-form-item label="Use Match Timestamp" prop="alertaUseMatchTimestamp">
      <el-switch
        id="alertaUseMatchTimestamp"
        v-model="alertaUseMatchTimestamp"
        :disabled="viewOnly"
        @change="changeAlertaUseMatchTimestamp" />
    </el-form-item>

    <el-form-item label="Use Qk As Resource" prop="alertaUseQkAsResource">
      <el-switch
        id="alertaUseQkAsResource"
        v-model="alertaUseQkAsResource"
        :disabled="viewOnly"
        @change="changeAlertaUseQkAsResource" />
    </el-form-item>

    <el-form-item label="Api Skip Ssl" prop="alertaApiSkipSsl">
      <el-switch
        id="alertaApiSkipSsl"
        v-model="alertaApiSkipSsl"
        :disabled="viewOnly"
        @change="changeAlertaApiSkipSsl" />
    </el-form-item>

    <el-form-item label="Origin" prop="alertaOrigin">
      <el-input id="alertaOrigin" v-model="alertaOrigin" :disabled="viewOnly" />
      <label>Defaults to “elastalert”.</label>
    </el-form-item>

    <el-form-item label="Value" prop="alertaValue">
      <el-input id="alertaValue" v-model="alertaValue" :disabled="viewOnly" />
      <label>Defaults to “”.</label>
    </el-form-item>

    <el-form-item label="Type" prop="alertaType">
      <el-input id="alertaType" v-model="alertaType" :disabled="viewOnly" />
      <label>Defaults to “elastalert”.</label>
    </el-form-item>

    <el-popover v-model="popalertaServiceVisible" :class="{ 'is-invalid': !popalertaServiceValid }">
      <template v-slot:reference>
        <span class="pop-trigger">
          <el-tooltip v-if="alertaService.length" :content="alertaService.join(', ')" placement="top">
            <span>Services ({{ alertaService.length }})</span>
          </el-tooltip>
          <span v-else>Services ({{ alertaService.length }})</span>
        </span>
      </template>
      <template>
        <el-form
          ref="alertaService"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in alertaService"
            :key="index"
            :prop="'alertaService.' + index"
            :disabled="viewOnly"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="alertaService[index]"
                  :disabled="viewOnly"
                  placeholder="Tags"
                  @input="(val) => updatealertaService(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removealertaServiceEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addalertaServiceEntry">
          Add Services
        </el-button>
      </template>
    </el-popover>

    <el-popover v-model="popalertaCorrelateVisible" :class="{ 'is-invalid': !popalertaCorrelateValid }">
      <template v-slot:reference>
        <span class="pop-trigger">
          <el-tooltip v-if="alertaCorrelate.length" :content="alertaCorrelate.join(', ')" placement="top">
            <span>Correlates ({{ alertaCorrelate.length }})</span>
          </el-tooltip>
          <span v-else>Correlatea ({{ alertaCorrelate.length }})</span>
        </span>
      </template>
      <template>
        <el-form
          ref="alertaCorrelate"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in alertaCorrelate"
            :key="index"
            :prop="'alertaCorrelate.' + index"
            :disabled="viewOnly"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="alertaCorrelate[index]"
                  :disabled="viewOnly"
                  placeholder="Correlates"
                  @input="(val) => updatealertaCorrelate(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removealertaCorrelateEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addalertaCorrelateEntry">
          Add Correlates
        </el-button>
      </template>
    </el-popover>

    <el-popover v-model="popalertaAttributesKeysVisible" :class="{ 'is-invalid': !popalertaAttributesKeysValid }">
      <template v-slot:reference>
        <span class="pop-trigger">
          <el-tooltip v-if="alertaAttributesKeys.length" :content="alertaAttributesKeys.join(', ')" placement="top">
            <span>AttributesKeys ({{ alertaAttributesKeys.length }})</span>
          </el-tooltip>
          <span v-else>AttributesKeys ({{ alertaAttributesKeys.length }})</span>
        </span>
      </template>
      <template>
        <el-form
          ref="alertaAttributesKeys"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in alertaAttributesKeys"
            :key="index"
            :prop="'alertaAttributesKeys.' + index"
            :disabled="viewOnly"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="alertaAttributesKeys[index]"
                  :disabled="viewOnly"
                  placeholder="AttributesKeys"
                  @input="(val) => updatealertaAttributesKeys(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removealertaAttributesKeysEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addalertaAttributesKeysEntry">
          Add AttributesKeys
        </el-button>
      </template>
    </el-popover>

    <el-popover v-model="popalertaAttributesValuesVisible" :class="{ 'is-invalid': !popalertaAttributesValuesValid }">
      <template v-slot:reference>
        <span class="pop-trigger">
          <el-tooltip v-if="alertaAttributesValues.length" :content="alertaAttributesValues.join(', ')" placement="top">
            <span>AttributesValues ({{ alertaAttributesValues.length }})</span>
          </el-tooltip>
          <span v-else>AttributesValues ({{ alertaAttributesValues.length }})</span>
        </span>
      </template>
      <template>
        <el-form
          ref="alertaAttributesValues"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in alertaAttributesValues"
            :key="index"
            :prop="'alertaAttributesValues.' + index"
            :disabled="viewOnly"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="alertaAttributesValues[index]"
                  :disabled="viewOnly"
                  placeholder="AttributesValues"
                  @input="(val) => updatealertaAttributesValues(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removealertaAttributesValuesEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addalertaAttributesValuesEntry">
          Add AttributesValues
        </el-button>
      </template>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: ['viewOnly'],

  data() {
    return {
      popalertaAttributesValuesVisible: false,
      popalertaAttributesValuesValid: true,
      popalertaAttributesKeysVisible: false,
      popalertaAttributesKeysValid: true,
      popalertaCorrelateVisible: false,
      popalertaCorrelateValid: true,
      popalertaServiceVisible: false,
      popalertaServiceValid: true,
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
      }]
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

    alertaService: {
      get() {
        return this.$store.state.config.alert.alertaService;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_SERVICE', value);
      }
    },

    alertaCorrelate: {
      get() {
        return this.$store.state.config.alert.alertaCorrelate;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_CORRELATE', value);
      }
    },

    alertaAttributesKeys: {
      get() {
        return this.$store.state.config.alert.alertaAttributesKeys;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_ATTRIBUTES_KEYS', value);
      }
    },

    alertaAttributesValues: {
      get() {
        return this.$store.state.config.alert.alertaAttributesValues;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_ATTRIBUTES_VALUES', value);
      }
    },

    alertaEnvironment: {
      get() {
        return this.$store.state.config.alert.alertaEnvironment;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERTA_ENVIRONMENT', value);
      }
    },

    alertaTimeout: {
      get() {
        return this.$store.state.config.alert.alertaTimeout;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ALERTA_TIMEOUT',
          value
        );
      }
    },

    alertaUseMatchTimestamp: {
      get() {
        return this.$store.state.config.alert.alertaUseMatchTimestamp;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ALERTA_USE_MATCH_TIMESTAMP',
          value
        );
      }
    },

    alertaUseQkAsResource: {
      get() {
        return this.$store.state.config.alert.alertaUseQkAsResource;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ALERTA_USE_QK_AS_RESOURCE',
          value
        );
      }
    },

    alertaApiSkipSsl: {
      get() {
        return this.$store.state.config.alert.alertaApiSkipSsl;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ALERTA_API_SKIP_SSL',
          value
        );
      }
    },

    alertaOrigin: {
      get() {
        return this.$store.state.config.alert.alertaOrigin;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ALERTA_ORIGIN',
          value
        );
      }
    },

    alertaValue: {
      get() {
        return this.$store.state.config.alert.alertaValue;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ALERTA_VALUE',
          value
        );
      }
    },

    alertaType: {
      get() {
        return this.$store.state.config.alert.alertaType;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ALERTA_TYPE',
          value
        );
      }
    }
  },

  methods: {
    async validate() {
      try {
        if (this.$refs.alertaTags) {
          await this.validateAlertaTags();
        }
        if (this.$refs.alertaService) {
          await this.validatealertaService();
        }
        if (this.$refs.alertaCorrelate) {
          await this.validatealertaCorrelate();
        }
        if (this.$refs.alertaAttributesKeys) {
          await this.validatealertaAttributesKeys();
        }
        if (this.$refs.alertaAttributesValues) {
          await this.validatealertaAttributesValues();
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
    },

    async validatealertaService() {
      if (!this.alertaService.length) {
        this.popalertaServiceValid = false;
        return;
      }
      try {
        this.popalertaServiceValid = await this.$refs.alertaService.validate();
      } catch (error) {
        this.popalertaServiceValid = false;
        throw error;
      }
    },

    updatealertaService(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_ALERTA_SERVICE_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removealertaServiceEntry(entry) {
      this.$store.commit('config/alert/REMOVE_ALERTA_SERVICE_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addalertaServiceEntry() {
      this.$store.commit('config/alert/ADD_ALERTA_SERVICE_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    async validatealertaCorrelate() {
      if (!this.alertaCorrelate.length) {
        this.popalertaCorrelateValid = false;
        return;
      }
      try {
        this.popalertaCorrelateValid = await this.$refs.alertaCorrelate.validate();
      } catch (error) {
        this.popalertaCorrelateValid = false;
        throw error;
      }
    },

    updatealertaCorrelate(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_ALERTA_CORRELATE_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removealertaCorrelateEntry(entry) {
      this.$store.commit('config/alert/REMOVE_ALERTA_CORRELATE_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addalertaCorrelateEntry() {
      this.$store.commit('config/alert/ADD_ALERTA_CORRELATE_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    async validatealertaAttributesKeys() {
      if (!this.alertaAttributesKeys.length) {
        this.popalertaAttributesKeysValid = false;
        return;
      }
      try {
        this.popalertaAttributesKeysValid = await this.$refs.alertaAttributesKeys.validate();
      } catch (error) {
        this.popalertaAttributesKeysValid = false;
        throw error;
      }
    },

    updatealertaAttributesKeys(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_ALERTA_ATTRIBUTES_KEYS_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removealertaAttributesKeysEntry(entry) {
      this.$store.commit('config/alert/REMOVE_ALERTA_ATTRIBUTES_KEYS_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addalertaAttributesKeysEntry() {
      this.$store.commit('config/alert/ADD_ALERTA_ATTRIBUTES_KEYS_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    async validatealertaAttributesValues() {
      if (!this.alertaAttributesValues.length) {
        this.popalertaAttributesValuesValid = false;
        return;
      }
      try {
        this.popalertaAttributesValuesValid = await this.$refs.alertaAttributesValues.validate();
      } catch (error) {
        this.popalertaAttributesValuesValid = false;
        throw error;
      }
    },

    updatealertaAttributesValues(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_ALERTA_ATTRIBUTES_VALUES_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removealertaAttributesValuesEntry(entry) {
      this.$store.commit('config/alert/REMOVE_ALERTA_ATTRIBUTES_VALUES_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addalertaAttributesValuesEntry() {
      this.$store.commit('config/alert/ADD_ALERTA_ATTRIBUTES_VALUES_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    changeAlertaUseMatchTimestamp(val) {
      if (val) {
        this.alertaUseMatchTimestamp = true;
      } else {
        this.alertaUseMatchTimestamp = false;
      }
    },

    changeAlertaUseQkAsResource(val) {
      if (val) {
        this.alertaUseQkAsResource = true;
      } else {
        this.alertaUseQkAsResource = false;
      }
    },

    changeAlertaApiSkipSsl(val) {
      if (val) {
        this.alertaApiSkipSsl = true;
      } else {
        this.alertaApiSkipSsl = false;
      }
    },
  }
};
</script>

<style lang="scss">

</style>
