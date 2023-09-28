<template>
  <!-- native modifier has been removed, please confirm whether the function has been affected  -->
  <el-form
    ref="form"
    :model="$store.state.config.alert"
    label-position="top"
    @submit.prevent>
    <el-row :gutter="50">
      <el-col :span="12">
        <el-form-item
          id="subject"
          label="Subject"
          prop="subject"
          required>
          <!-- native modifier has been removed, please confirm whether the function has been affected  -->
          <at
            v-model="subject"
            :members="fields"
            :allow-spaces="false"
            at="%"
            @paste="pastePlainText">
            <template #embeddedItem="s">
              <span>
                <el-tag :data-term="s.current" size="mini" type="info">{{ s.current }}</el-tag>
              </span>
            </template>
            <div :contenteditable="!viewOnly" />
            <label v-if="!viewOnly">Insert fields by typing '%' followed by the field name</label>
          </at>
        </el-form-item>

        <el-popover v-model="popAlertSubjectArgsVisible" :class="{ 'is-invalid': !popAlertSubjectArgsValid }">
          <template #reference>
            <span class="pop-trigger">
              <el-tooltip v-if="alertSubjectArgs.length" :content="alertSubjectArgs.join(', ')" placement="top">
                <span>AlertSubjectArgs ({{ alertSubjectArgs.length }})</span>
              </el-tooltip>
              <span v-else>AlertSubjectArgs ({{ alertSubjectArgs.length }})</span>
            </span>
          </template>
          <div>
            <!-- native modifier has been removed, please confirm whether the function has been affected  -->
            <el-form
              ref="alertSubjectArgs"
              :model="$store.state.config.alert"
              label-position="top"
              style="width: 360px"
              @submit.prevent>
              <el-form-item
                v-for="(entry, index) in alertSubjectArgs"
                :key="index"
                :prop="'alertSubjectArgs.' + index"
                :disabled="viewOnly"
                class="el-form-item-list"
                label=""
                required>
                <el-row :gutter="5" justify="space-between">
                  <el-col :span="20">
                    <el-input
                      v-model="alertSubjectArgs[index]"
                      :disabled="viewOnly"
                      placeholder=""
                      @input="(val) => updateAlertSubjectArgs(val, index)" />
                  </el-col>
                  <el-col :span="4">
                    <el-button
                      :disabled="viewOnly"
                      type="danger"
                      :icon="ElIconDelete"
                      circle
                      plain
                      @click="removeAlertSubjectArgsEntry(entry)" />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>

            <el-button :disabled="viewOnly" class="m-n-sm" @click="addAlertSubjectArgsEntry">
              Add alert_subject_args
            </el-button>
          </div>
        </el-popover>

        <el-form-item
          v-if="bodyType !== 'aggregation_summary_only'"
          id="body"
          label="Body text"
          prop="body">
          <!-- native modifier has been removed, please confirm whether the function has been affected  -->
          <at
            v-model="body"
            :members="fields"
            :allow-spaces="false"
            at="%"
            @paste="pastePlainText">
            <template #embeddedItem="s">
              <span>
                <el-tag :data-term="s.current" size="mini" type="info">{{ s.current }}</el-tag>
              </span>
            </template>
            <div :contenteditable="!viewOnly" />
            <label v-if="!viewOnly">Insert fields by typing '%' followed by the field name</label>
          </at>
        </el-form-item>

        <el-popover
          v-if="bodyType !== 'aggregation_summary_only'"
          v-model="popAlertTextArgsVisible"
          :class="{ 'is-invalid': !popAlertTextArgsValid }">
          <template #reference>
            <span class="pop-trigger">
              <el-tooltip v-if="alertTextArgs.length" :content="alertTextArgs.join(', ')" placement="top">
                <span>alertTextArgs ({{ alertTextArgs.length }})</span>
              </el-tooltip>
              <span v-else>alertTextArgs ({{ alertTextArgs.length }})</span>
            </span>
          </template>
          <div>
            <!-- native modifier has been removed, please confirm whether the function has been affected  -->
            <el-form
              ref="alertTextArgs"
              :model="$store.state.config.alert"
              label-position="top"
              style="width: 360px"
              @submit.prevent>
              <el-form-item
                v-for="(entry, index) in alertTextArgs"
                :key="index"
                :prop="'alertTextArgs.' + index"
                :disabled="viewOnly"
                class="el-form-item-list"
                label=""
                required>
                <el-row :gutter="5" justify="space-between">
                  <el-col :span="20">
                    <el-input
                      v-model="alertTextArgs[index]"
                      :disabled="viewOnly"
                      placeholder=""
                      @input="(val) => updateAlertTextArgs(val, index)" />
                  </el-col>
                  <el-col :span="4">
                    <el-button
                      :disabled="viewOnly"
                      type="danger"
                      :icon="ElIconDelete"
                      circle
                      plain
                      @click="removeAlertTextArgsEntry(entry)" />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>

            <el-button :disabled="viewOnly" class="m-n-sm" @click="addAlertTextArgsEntry">
              Add alert_text_args
            </el-button>
          </div>
        </el-popover>

        <el-form-item required label="Include">
          <el-row>
            <el-select v-model="bodyType" :disabled="viewOnly">
              <el-option value="alert_text_only" label="Body text" />
              <el-option value="exclude_fields" label="Body text &amp; trigger details &amp; top counts" />
              <el-option
                value="default"
                label="Body text &amp; trigger details &amp; top counts &amp; field values" />
              <el-option
                v-if="summaryTableFields.length"
                value="aggregation_summary_only"
                label="Aggregation summary only" />
            </el-select>
          </el-row>
        </el-form-item>
      </el-col>

      <el-col :span="12" class="preview-container">
        <h6 class="m-n-xs">
          Subject preview
        </h6>
        <div class="preview">
          {{ $store.getters['config/alert/subjectRendered'] }}
        </div>

        <h6 class="m-n-lg">
          Body preview
        </h6>
        <div v-if="summaryTableFields.length" type="info">
          <em>(Summary table)</em>
        </div>

        <div class="preview">
          {{ $store.getters['config/alert/bodyRendered'] }}
        </div>
        <br v-if="$store.getters['config/alert/bodyRendered']">

        <div class="preview">
          <div
            v-if="bodyType === 'default' || bodyType === 'exclude_fields'"
            type="info">
            <em>(Trigger details)</em>
          </div>
          <div
            v-if="bodyType === 'default' || bodyType === 'exclude_fields'"
            type="info">
            <em>(Top counts)</em>
          </div>
          <div v-if="bodyType === 'default'" type="info">
            <em>(Field values)</em>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { Delete as ElIconDelete } from '@element-plus/icons-vue';
import debounce from 'debounce';
import At from 'vue-at';

export default {
  components: {
    At
  },

  props: ['viewOnly'],
  emits: ['validate'],

  data() {
    return {
      ElIconDelete,
      popAlertSubjectArgsVisible: false,
      popAlertSubjectArgsValid: true,
      popAlertTextArgsVisible: false,
      popAlertTextArgsValid: true,
    };
  },

  computed: {
    queryString() {
      return this.$store.getters['config/query/queryString'];
    },

    summaryTableFields() {
      return this.$store.state.config.alert.summaryTableFields || [];
    },

    subject: {
      get() {
        return this.$store.state.config.alert.subject;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_SUBJECT', value);
      }
    },

    alertSubjectArgs: {
      get() {
        return this.$store.state.config.alert.alertSubjectArgs;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERT_SUBJECT_ARGS', value);
      }
    },

    alertTextArgs: {
      get() {
        return this.$store.state.config.alert.alertTextArgs;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_ALERT_TEXT_ARGS', value);
      }
    },

    body: {
      get() {
        return this.$store.state.config.alert.body;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_BODY', value);
      }
    },

    bodyType: {
      get() {
        return this.$store.state.config.alert.bodyType;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_BODY_TYPE', value);
      }
    },

    fields() {
      return this.$store.getters[
        'metadata/templateFieldsForCurrentConfig'
      ];
    }
  },

  watch: {
    queryString() {
      this.sampleDebounced();
    }
  },

  mounted() {
    this.$store.dispatch('config/sample');
  },

  methods: {
    sampleDebounced: debounce(function() {
      this.$store.dispatch('config/sample');
    }, 750),

    pastePlainText(e) {
      e.preventDefault();
      let text = (e.originalEvent || e).clipboardData.getData('text/plain');

      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      range.deleteContents();

      const node = document.createElement('div');
      node.style.whiteSpace = 'pre';
      node.innerHTML = text;
      range.insertNode(node);

      // Move the cursor to the end of the inserted string
      selection.collapseToEnd();
    },

    async validate() {
      try {
        if (this.$refs.alertSubjectArgs) {
          await this.validateAlertSubjectArgs();
        }
        if (this.$refs.alertTextArgs) {
          await this.validateAlertTextArgs();
        }
        this.$emit('validate', true);
        return true;
      } catch (error) {
        this.$emit('validate', false);
        return false;
      }
    },

    async validateAlertSubjectArgs() {
      if (!this.alertSubjectArgs.length) {
        this.popAlertSubjectArgsValid = false;
        return;
      }
      try {
        this.popAlertSubjectArgsValid = await this.$refs.alertSubjectArgs.validate();
      } catch (error) {
        this.popAlertSubjectArgsValid = false;
        throw error;
      }
    },

    async validateAlertTextArgs() {
      if (!this.alertTextArgs.length) {
        this.popAlertTextArgsValid = false;
        return;
      }
      try {
        this.popAlertTextArgsValid = await this.$refs.alertTextArgs.validate();
      } catch (error) {
        this.popAlertTextArgsValid = false;
        throw error;
      }
    },

    updateAlertSubjectArgs(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_ALERT_SUBJECT_ARGS_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    updateAlertTextArgs(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_ALERT_TEXT_ARGS_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removeAlertSubjectArgsEntry(entry) {
      this.$store.commit('config/alert/REMOVE_ALERT_SUBJECT_ARGS_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    removeAlertTextArgsEntry(entry) {
      this.$store.commit('config/alert/REMOVE_ALERT_TEXT_ARGS_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addAlertSubjectArgsEntry() {
      this.$store.commit('config/alert/ADD_ALERT_SUBJECT_ARGS_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    addAlertTextArgsEntry() {
      this.$store.commit('config/alert/ADD_ALERT_TEXT_ARGS_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    }
  }
};
</script>

<style scoped>
.atwho-wrap >>> .atwho-panel {
  position: initial;
}
.preview-container {
  padding: 25px 0;
  background: #eee;
}

.preview {
  white-space: pre-wrap;
  line-height: 1.3;
  font-family: monospace;
}

.el-select {
  width: 340px;
}

.el-tag {
  margin-right: 5px;
}

.el-checkbox.is-bordered.el-checkbox--mini {
  height: auto;
}

[contenteditable="false"] {
  border: 0 !important;
  padding: 0 !important;
}

[contenteditable] {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 5px 10px;
  overflow-y: auto;
  line-height: 1.4;
}

[contenteditable]:focus {
  border: 1px solid #ccc;
  outline: none;
}

[contenteditable] .el-tag {
  margin-right: 0;
}

[contenteditable] + label {
  display: block;
  color: #86898f;
  line-height: 1.3;
  font-size: 12px;
  padding-top: 8px;
}

.el-card {
  margin-bottom: 20px;
}

h6 {
  font-size: 13px;
}
</style>
