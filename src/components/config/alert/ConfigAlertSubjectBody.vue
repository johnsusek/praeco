<template>
  <el-form
    ref="form"
    :model="$store.state.config.alert"
    label-position="top"
    @submit.native.prevent>

    <el-row :gutter="50">
      <el-col :span="12">
        <el-form-item
          id="subject"
          label="Subject"
          prop="subject"
          required>
          <at
            v-model="subject"
            :members="fields"
            :allow-spaces="false"
            at="%">
            <span slot="embeddedItem" slot-scope="s">
              <el-tag :data-term="s.current" size="mini" type="info">{{ s.current }}</el-tag>
            </span>
            <div :contenteditable="!viewOnly" />
            <label v-if="!viewOnly">Insert fields by typing '%' followed by the field name</label>
          </at>
        </el-form-item>

        <el-form-item
          v-if="bodyType !== 'aggregation_summary_only'"
          id="body"
          label="Body text"
          prop="body">
          <at
            v-model="body"
            :members="fields"
            :allow-spaces="false"
            at="%">
            <span slot="embeddedItem" slot-scope="s">
              <el-tag :data-term="s.current" size="mini" type="info">{{ s.current }}</el-tag>
            </span>
            <div :contenteditable="!viewOnly" />
            <label v-if="!viewOnly">Insert fields by typing '%' followed by the field name</label>
          </at>
        </el-form-item>

        <el-form-item required label="Include">
          <el-row>
            <el-select v-model="bodyType" :disabled="viewOnly">
              <el-option value="alert_text_only" label="Body text" />
              <el-option value="exclude_fields" label="Body text &amp; trigger details &amp; top counts"/>
              <el-option
                value="default"
                label="Body text &amp; trigger details &amp; top counts &amp; field values"/>
              <el-option
                v-if="summaryTableFields.length"
                value="aggregation_summary_only"
                label="Aggregation summary only"/>
            </el-select>
          </el-row>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <h6 class="m-n-xs">Subject preview</h6>
        <div class="preview">{{ $store.getters['config/alert/subjectRendered'] }}</div>

        <h6>Body preview</h6>
        <div v-if="summaryTableFields.length" type="info"><em>(Summary table)</em></div>

        <div class="preview">{{ $store.getters['config/alert/bodyRendered'] }}</div>

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
        <div v-if="bodyType === 'default'" type="info"><em>(Field values)</em></div>
      </el-col>
    </el-row>

  </el-form>
</template>

<script>
import debounce from 'debounce';
import At from 'vue-at';

export default {
  components: {
    At
  },

  props: ['viewOnly'],

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
      let fields = [];
      let mappingFields = this.$store.getters[
        'metadata/templateFieldsForCurrentConfig'
      ];

      // Handle JSON fields with dot notation
      Object.entries(mappingFields).forEach(([field, mapping]) => {
        if (mapping.properties) {
          Object.entries(mapping.properties).forEach(([f]) => {
            fields.push(`${field}.${f}`);
          });
        } else {
          fields.push(field);
        }
      });

      return fields;
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
    }, 750)
  }
};
</script>

<style scoped>
.preview {
  white-space: pre-wrap;
  line-height: 1.3;
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
</style>

