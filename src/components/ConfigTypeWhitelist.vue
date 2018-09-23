<template>
  <div>
    <el-form-item label="Field" required>
      <el-select
        v-model="config.compare_key"
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

    <el-form-item label="Whitelist" required>
      <template>
        <el-form-item
          v-for="(entry, index) in config.whitelist"
          :key="index"
          :prop="'whitelist.' + index"
          :rules="{ required: true, message: 'entry can not be null', trigger: 'blur' }"
          class="el-form-item-list"
          label="">
          <el-row :gutter="5" type="flex" justify="space-between">
            <el-col :span="10">
              <el-input v-model="config.whitelist[index]" placeholder="Keyword" />
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
      <el-switch v-model="config.ignore_null" />
      <label>If set, events without the selected field will not match.</label>
    </el-form-item>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  props: ['config', 'fields'],
  methods: {
    removeEntry(item) {
      let index = this.config.whitelist.indexOf(item);
      if (index !== -1) {
        this.config.whitelist.splice(index, 1);
      }
    },
    addEntry() {
      if (!this.config.whitelist) {
        Vue.set(this.config, 'whitelist', []);
      }
      this.config.whitelist.push('');
    }
  }
};
</script>
