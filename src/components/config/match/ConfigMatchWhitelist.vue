<template>
  <el-form ref="form" :model="form" label-position="top" @submit.native.prevent>
    <el-form-item label="Field" prop="compareKey" required>
      <el-select
        v-model="form.compareKey"
        filterable
        placeholder="Field">
        <el-option
          v-for="field in Object.keys(fields)"
          :key="field"
          :label="field"
          :value="field" />
      </el-select>
      <label>The name of the field to use to compare to the whitelist.</label>
    </el-form-item>

    <el-form-item label="Whitelist" prop="whitelist" required>
      <template>
        <el-form-item
          v-for="(entry, index) in form.whitelist"
          :key="index"
          :prop="'whitelist.' + index"
          :rules="{ required: true, message: 'entry can not be null', trigger: 'blur' }"
          class="el-form-item-list"
          label="">
          <el-row :gutter="5" type="flex" justify="space-between">
            <el-col :span="10">
              <el-input v-model="form.whitelist[index]" placeholder="Keyword" />
            </el-col>
            <el-col :span="14">
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                plain
                @click.prevent="removeEntry(entry)" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-button @click="addEntry">Add whitelist keyword</el-button>
      </template>
    </el-form-item>

    <el-form-item label="Ignore null">
      <el-switch v-model="form.ignoreNull" @input="updateIgnoreNull" />
      <label>If set, events without the selected field will not match.</label>
    </el-form-item>
  </el-form>
</template>

<script>
import Vue from 'vue';
import { validateForm } from '@/mixins/validateForm';

export default {
  mixins: [validateForm],

  props: ['fields', 'compareKey', 'whitelist', 'ignoreNull'],

  mounted() {
    if (this.compareKey) {
      Vue.set(this.form, 'compareKey', this.compareKey);
    }

    if (this.whitelist) {
      Vue.set(this.form, 'whitelist', this.whitelist);
    }

    if (this.ignoreNull) {
      Vue.set(this.form, 'ignoreNull', this.ignoreNull);
    }
  },

  methods: {
    updateIgnoreNull(val) {
      if (!val) {
        Vue.delete(this.form, 'ignoreNull');
      }
    },

    removeEntry(item) {
      let index = this.form.whitelist.indexOf(item);
      if (index !== -1) {
        this.form.whitelist.splice(index, 1);
      }
      if (this.form.whitelist.length === 0) {
        Vue.delete(this.form, 'whitelist');
      }
    },

    addEntry() {
      if (!this.form.whitelist) {
        Vue.set(this.form, 'whitelist', []);
      }
      this.form.whitelist.push('');
    }
  },
};
</script>
