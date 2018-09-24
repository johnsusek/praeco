<template>
  <div>
    <br>

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
      <label>The name of the field to use to compare to the blacklist.</label>
    </el-form-item>

    <el-form-item label="Blacklist" required>
      <template>
        <el-form-item
          v-for="(entry, index) in config.blacklist"
          :key="index"
          :prop="'blacklist.' + index"
          :rules="{ required: true, message: 'entry can not be null', trigger: 'blur' }"
          class="el-form-item-list"
          label="">
          <el-row :gutter="5" type="flex" justify="space-between">
            <el-col :span="10">
              <el-input v-model="config.blacklist[index]" placeholder="Keyword" />
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
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  props: ['config', 'fields'],
  watch: {
    config: {
      deep: true,
      handler() {
        if (this.config.type !== 'blacklist') {
          delete this.config.blacklist;
          delete this.config.compare_key;
        }
      }
    }
  },
  methods: {
    removeEntry(item) {
      let index = this.config.blacklist.indexOf(item);
      if (index !== -1) {
        this.config.blacklist.splice(index, 1);
      }
    },
    addEntry() {
      if (!this.config.blacklist) {
        Vue.set(this.config, 'blacklist', []);
      }
      this.config.blacklist.push('');
    }
  }
};
</script>
