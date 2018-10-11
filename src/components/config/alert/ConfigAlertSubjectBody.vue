<template>
  <div>
    <el-form-item
      label="Subject"
      prop="alert_subject"
      required>
      <at
        v-model="value.alert_subject"
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
      v-if="value.alert_text_type !== 'aggregation_summary_only'"
      label="Body text"
      prop="alert_text">
      <at
        v-model="value.alert_text"
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
        <el-select v-model="attach">
          <el-option value="alert_text_only" label="Body text only" />
          <el-option value="exclude_fields" label="Include trigger details &amp; top counts"/>
          <el-option
            value="default"
            label="Include trigger details &amp; top counts &amp; field values"/>
        </el-select>
      </el-row>
    </el-form-item>
  </div>
</template>

<script>
import At from 'vue-at';

export default {
  components: {
    At,
  },

  props: ['value', 'fields', 'alertTextTypePrefill'],

  data() {
    return {
      attach: '',
    };
  },

  computed: {
    alertTextType() {
      if (this.attach === 'default') {
        return undefined;
      }
      return this.attach;
    }
  },

  watch: {
    attach: {
      initial: true,
      handler() {
        if (this.alertTextType) {
          this.$set(this.value, 'alert_text_type', this.alertTextType);
        } else {
          this.$delete(this.value, 'alert_text_type');
        }
      }
    },
    alertTextTypePrefill: {
      initial: true,
      handler() {
        if (this.alertTextTypePrefill) {
          this.attach = this.alertTextTypePrefill;
        } else {
          this.attach = 'default';
        }
      }
    }
  },

  mounted() {
    if (this.alertTextTypePrefill) {
      this.attach = this.alertTextTypePrefill;
    } else {
      this.attach = 'default';
    }
  },
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

