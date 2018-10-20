<template>
  <el-form
    ref="form"
    :model="$store.state.config.alert"
    label-position="top"
    @submit.native.prevent>

    <el-row :gutter="100">
      <el-col :span="12">
        <el-form-item
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
            <div contenteditable />
            <label>Insert fields by typing '%' followed by the field name</label>
          </at>
        </el-form-item>

        <el-form-item
          v-if="bodyType !== 'aggregation_summary_only'"
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
            <div contenteditable />
            <label>Insert fields by typing '%' followed by the field name</label>
          </at>
        </el-form-item>

        <el-form-item required label="Include">
          <el-row>
            <el-select v-model="bodyType">
              <el-option value="alert_text_only" label="Body text only" />
              <el-option value="exclude_fields" label="Include trigger details &amp; top counts"/>
              <el-option
                value="default"
                label="Include trigger details &amp; top counts &amp; field values"/>
            </el-select>
          </el-row>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <h6>Subject preview</h6>
        {{ $store.getters['config/alert/subjectRendered'] }}

        <h6>Body preview</h6>
        {{ $store.getters['config/alert/bodyRendered'] }}

        <div
          v-if="bodyType === 'default' || bodyType === 'exclude_fields'"
          type="info">
          (Trigger details)
        </div>
        <div
          v-if="bodyType === 'default' || bodyType === 'exclude_fields'"
          type="info">
          (Top counts)
        </div>
        <div v-if="bodyType === 'default'" type="info">(Field values)</div>
      </el-col>
    </el-row>

  </el-form>
</template>

<script>
import At from 'vue-at';

export default {
  components: {
    At,
  },

  computed: {
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
      let mappingFields = this.$store.getters['metadata/fieldsForCurrentConfig'];

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
  }
};
</script>

<style scoped>
.el-select {
  width: 340px;
}

.el-tag {
  margin-right: 5px;
}

.el-checkbox.is-bordered.el-checkbox--mini {
  height: auto;
}

[contenteditable] {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
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
