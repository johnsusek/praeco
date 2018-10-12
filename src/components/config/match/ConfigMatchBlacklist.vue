<template>
  <el-form
    ref="form"
    :model="$store.state.config.match"
    label-position="top"
    @submit.native.prevent>
    <el-form-item label="Field" prop="compareKey" required>
      <el-select
        v-model="compareKey"
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
          v-for="(entry, index) in $store.state.config.match.blacklist"
          :key="index"
          :prop="'blacklist.' + index"
          :rules="{ required: true, message: 'entry can not be null', trigger: 'blur' }"
          class="el-form-item-list"
          label="">
          <el-row :gutter="5" type="flex" justify="space-between">
            <el-col :span="10">
              <el-input
                v-model="$store.state.config.match.blacklist[index]"
                placeholder="Keyword"
                @input="(val) => updateBlacklist(val, index)" />
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

export default {
  computed: {
    fields() {
      return this.$store.getters['metadata/fieldsForCurrentConfig'];
    },

    compareKey: {
      get() {
        return this.$store.state.config.match.compareKey;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_COMPARE_KEY', value);
      }
    }
  },

  methods: {
    updateBlacklist(entry, index) {
      this.$store.commit('config/match/UPDATE_BLACKLIST_ENTRY', { entry, index });
    },

    removeEntry(entry) {
      this.$store.commit('config/match/REMOVE_BLACKLIST_ENTRY', entry);
    },

    addEntry() {
      this.$store.commit('config/match/ADD_BLACKLIST_ENTRY');
    }
  }
};
</script>
