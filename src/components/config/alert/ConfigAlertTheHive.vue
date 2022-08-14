<template>
  <div>
    <praeco-form-item label="Hive Alert Config Title" prop="hiveAlertConfigTitle">
      <el-input id="hiveAlertConfigTitle" v-model="hiveAlertConfigTitle" :disabled="viewOnly" />
      <label>Alert's description.</label>
    </praeco-form-item>

    <praeco-form-item label="Hive Alert Config Type" prop="hiveAlertConfigType">
      <el-input id="hiveAlertConfigType" v-model="hiveAlertConfigType" :disabled="viewOnly" />
      <label>Alert's type.</label>
    </praeco-form-item>

    <praeco-form-item label="Hive Alert Config Source" prop="hiveAlertConfigSource">
      <el-input id="hiveAlertConfigSource" v-model="hiveAlertConfigSource" :disabled="viewOnly" />
      <label>Alert's source.</label>
    </praeco-form-item>

    <praeco-form-item label="Hive Alert Config Description" prop="hiveAlertConfigDescription">
      <el-input id="hiveAlertConfigDescription" v-model="hiveAlertConfigDescription" :disabled="viewOnly" />
      <label>Alert's description.</label>
    </praeco-form-item>

    <praeco-form-item label="Hive Alert Config Severity" prop="hiveAlertConfigSeverity">
      <el-input-number id="hiveAlertConfigSeverity" v-model.number="hiveAlertConfigSeverity" :min="1" :max="4" :disabled="viewOnly" />
      <label>Alert's severity: 1, 2, 3, 4 for LOW, MEDIUM, HIGH, CRTICAL.</label>
    </praeco-form-item>

    <el-popover v-model="pophiveAlertConfigTagsVisible" :class="{ 'is-invalid': !pophiveAlertConfigTagsValid }">
      <template #reference>
        <span class="pop-trigger">
          <el-tooltip v-if="hiveAlertConfigTags.length" :content="hiveAlertConfigTags.join(', ')" placement="top">
            <span>Tags ({{ hiveAlertConfigTags.length }})</span>
          </el-tooltip>
          <span v-else>Tags ({{ hiveAlertConfigTags.length }})</span>
        </span>
      </template>
      <template>
        <el-form
          ref="hiveAlertConfigTags"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.prevent>
          <el-form-item
            v-for="(entry, index) in hiveAlertConfigTags"
            :key="index"
            :prop="'hiveAlertConfigTags.' + index"
            :disabled="viewOnly"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5"  justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="hiveAlertConfigTags[index]"
                  :disabled="viewOnly"
                  placeholder="Tags"
                  @input="(val) => updateHiveAlertConfigTags(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removeHiveAlertConfigTagsEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addHiveAlertConfigTagsEntry">
          Add tags
        </el-button>
      </template>
    </el-popover>

    <praeco-form-item label="Hive Alert Config Tlp" prop="hiveAlertConfigTlp">
      <el-input-number id="hiveAlertConfigTlp" v-model.number="hiveAlertConfigTlp" :min="0" :max="3" :disabled="viewOnly" />
      <label>Alert's TLP: 0, 1, 2, 3 for WHITE, GREEN, AMBER, RED.</label>
    </praeco-form-item>

    <praeco-form-item label="Hive Alert Config Status" prop="hiveAlertConfigStatus">
      <el-radio-group v-model="hiveAlertConfigStatus" :disabled="viewOnly">
        <el-radio id="hiveAlertConfigStatusWaiting" label="Waiting" border>
          Waiting
        </el-radio>
        <el-radio id="hiveAlertConfigStatusInProgress" label="InProgress" border>
          InProgress
        </el-radio>
        <el-radio id="hiveAlertConfigStatusCancel" label="Cancel" border>
          Cancel
        </el-radio>
        <el-radio id="hiveAlertConfigStatusCompleted" label="Completed" border>
          Completed
        </el-radio>
      </el-radio-group>
      <label>Task's status: Waiting, InProgress, Cancel, Completed.</label>
    </praeco-form-item>

    <el-form-item label="Hive Alert Config Follow" prop="hiveAlertConfigFollow">
      <el-switch
        id="hiveAlertConfigFollow"
        v-model="hiveAlertConfigFollow"
        :disabled="viewOnly"
        @change="changeHiveAlertConfigFollow" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: ['viewOnly'],
  emits: ['validate'],

  data() {
    return {
      popHiveAlertConfigTagsVisible: false,
      popHiveAlertConfigTagsValid: true,
    };
  },

  computed: {
    hiveAlertConfigTitle: {
      get() {
        return this.$store.state.config.alert.hiveAlertConfigTitle;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_TITLE', value);
      }
    },

    hiveAlertConfigType: {
      get() {
        return this.$store.state.config.alert.hiveAlertConfigType;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_TYPE', value);
      }
    },

    hiveAlertConfigSource: {
      get() {
        return this.$store.state.config.alert.hiveAlertConfigSource;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_SOURCE', value);
      }
    },

    hiveAlertConfigDescription: {
      get() {
        return this.$store.state.config.alert.hiveAlertConfigDescription;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_DESCRIPTION', value);
      }
    },

    hiveAlertConfigSeverity: {
      get() {
        return this.$store.state.config.alert.hiveAlertConfigSeverity;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_SEVERITY', value);
      }
    },

    hiveAlertConfigTags: {
      get() {
        return this.$store.state.config.alert.hiveAlertConfigTags;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_TAGS', value);
      }
    },

    hiveAlertConfigTlp: {
      get() {
        return this.$store.state.config.alert.hiveAlertConfigTlp;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_TLP', value);
      }
    },

    hiveAlertConfigStatus: {
      get() {
        return this.$store.state.config.alert.hiveAlertConfigStatus;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_STATUS', value);
      }
    },

    hiveAlertConfigFollow: {
      get() {
        return this.$store.state.config.alert.hiveAlertConfigFollow;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_FOLLOW', value);
      }
    }
  },

  methods: {
    changeHiveAlertConfigFollow(val) {
      if (val) {
        this.hiveAlertConfigFollow = true;
      } else {
        this.hiveAlertConfigFollow = false;
      }
    },

    async validate() {
      try {
        if (this.$refs.hiveAlertConfigTags) {
          await this.validateHiveAlertConfigTags();
        }
        this.$emit('validate', true);
        return true;
      } catch (error) {
        this.$emit('validate', false);
        return false;
      }
    },

    async validateHiveAlertConfigTags() {
      if (!this.hiveAlertConfigTags.length) {
        this.popHiveAlertConfigTagsValid = false;
        return;
      }
      try {
        this.popHiveAlertConfigTagsValid = await this.$refs.hiveAlertConfigTags.validate();
      } catch (error) {
        this.popHiveAlertConfigTagsValid = false;
        throw error;
      }
    },

    updateHiveAlertConfigTags(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_HIVE_ALERT_CONFIG_TAGS_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removeHiveAlertConfigTagsEntry(entry) {
      this.$store.commit('config/alert/REMOVE_HIVE_ALERT_CONFIG_TAGS_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addHiveAlertConfigTagsEntry() {
      this.$store.commit('config/alert/ADD_HIVE_ALERT_CONFIG_TAGS_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    }
  }
};
</script>

<style lang="scss">
</style>
