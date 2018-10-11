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
      <label>The name of the field to use to compare to the blacklist.</label>
    </el-form-item>

    <el-form-item label="Blacklist" prop="blacklist" required>
      <template>
        <el-form-item
          v-for="(entry, index) in form.blacklist"
          :key="index"
          :prop="'blacklist.' + index"
          :rules="{ required: true, message: 'entry can not be null', trigger: 'blur' }"
          class="el-form-item-list"
          label="">
          <el-row :gutter="5" type="flex" justify="space-between">
            <el-col :span="10">
              <el-input v-model="form.blacklist[index]" placeholder="Keyword" />
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

        <el-button @click="addEntry">Add blacklist keyword</el-button>
      </template>
    </el-form-item>
  </el-form>
</template>

<script>
import Vue from 'vue';
import { validateForm } from '@/mixins/validateForm';

export default {
  mixins: [validateForm],

  props: ['fields', 'compareKey', 'blacklist'],

  mounted() {
    if (this.compareKey) {
      Vue.set(this.form, 'compareKey', this.compareKey);
    }

    if (this.blacklist) {
      Vue.set(this.form, 'blacklist', this.blacklist);
    }
  },

  methods: {
    removeEntry(item) {
      let index = this.form.blacklist.indexOf(item);
      if (index !== -1) {
        this.form.blacklist.splice(index, 1);
      }
      if (this.form.blacklist.length === 0) {
        Vue.delete(this.form, 'blacklist');
      }
    },

    addEntry() {
      if (!this.form.blacklist) {
        Vue.set(this.form, 'blacklist', []);
      }
      this.form.blacklist.push('');
    }
  }
};
</script>
