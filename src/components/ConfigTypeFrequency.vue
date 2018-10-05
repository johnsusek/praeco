<template>
  <el-form ref="form" :model="config" label-position="top" @submit.native.prevent>
    <br>

    <el-form-item label="Number of events" prop="num_events" required>
      <el-input-number
        :min="1"
        :controls="false"
        v-model="config.num_events"
        @keyup.native="updateNumEvents"/>
      <label>The number of events which will trigger an alert, inclusive.</label>
    </el-form-item>

    <el-form-item label="Timeframe" props="timeframe" required>
      <ElastalertTimePicker v-model="config.timeframe" />
      <label>The time that the number of events must occur within.</label>
    </el-form-item>

    <el-button
      v-if="showAdvanced"
      type="text"
      @click="toggleAdvanced">
      <i class="el-icon-caret-bottom" />
      Hide advanced options
    </el-button>
    <el-button v-else type="text" @click="toggleAdvanced">
      <i class="el-icon-caret-right" />
      Show advanced options
    </el-button>

    <template v-if="showAdvanced">
      <el-form-item label="Use count query">
        <el-switch v-model="config.use_count_query" />
        <label>
          If true, ElastAlert will poll Elasticsearch using the count api,
          and not download all of the matching documents.
          This is useful is you care only about numbers and not the actual data.
          It should also be used if you expect a large number of query hits, in the order of
          tens of thousands or more. "Doc type" must be set to use this.
        </label>
      </el-form-item>

      <el-form-item label="Use terms query">
        <el-switch v-model="config.use_terms_query" @input="updateTermsSize" />
        <label>
          If true, ElastAlert will make an aggregation query against Elasticsearch
          to get counts of documents matching each unique value of "query key". This
          must be used with "query key" and "doc type". This will only return a maximum
          of "terms size", default 50, unique terms.
        </label>
      </el-form-item>

      <el-form-item v-if="config.use_terms_query" label="Terms size">
        <el-input-number :min="1" v-model="config.terms_size" />
        <label>
          When used with "use terms query", this is the maximum number of terms returned
          per query. Default is 50.
        </label>
      </el-form-item>

      <el-form-item :required="config.use_terms_query" prop="query_key" label="Query key">
        <el-select
          v-model="config.query_key"
          filterable
          clearable
          placeholder="Field"
          @input="updateQueryKey">
          <el-option
            v-for="field in Object.keys(fields)"
            :key="field"
            :label="field"
            :value="field" />
        </el-select>
        <label>
          Counts of documents will be stored independently for each value of "query key".
          Only "number of events" documents, all with the same value of "query key",
          will trigger an alert.
          <a href="https://github.com/Yelp/elastalert/blob/master/docs/source/ruletypes.rst#query_key" target="_blank">[?]</a>
        </label>
      </el-form-item>

      <el-form-item
        v-if="config.use_count_query || config.use_terms_query"
        label="Doc type"
        prop="doc_type"
        required>
        <el-select v-model="config.doc_type" placeholder="">
          <el-option
            v-for="type in types"
            :key="type"
            :label="type"
            :value="type"/>
        </el-select>
        <label>
          Specify the _type of document to search for.
          This must be present if "use count query" or "use terms query" is set.
        </label>
      </el-form-item>
    </template>

    <hr>

    <el-form-item label="Frequency visualizer" >
      <ESChart
        :mark-line="markLine"
        :timeframe="{ hours: 24 }"
        :bucket="config.timeframe"
        :query="query.query_string.query"
        :index="wildcardIndex" />
    </el-form-item>
  </el-form>
</template>

<script>
import Vue from 'vue';

export default {
  props: ['config', 'index', 'query', 'fields', 'types'],
  data() {
    return {
      showAdvanced: false,
      markLine: {}
    };
  },
  computed: {
    wildcardIndex() {
      let formattedIndex = this.config.index;

      if (this.config.use_strftime_index) {
        formattedIndex = formattedIndex.replace(/%[Ymd]/g, '*');
      }

      return formattedIndex;
    }
  },
  mounted() {
    this.updateMarkLine();
  },
  methods: {
    updateMarkLine() {
      this.markLine = {
        silent: true,
        lineStyle: {
          color: '#ff0000',
          type: 'solid'
        },
        animation: false,
        symbol: 'none',
        data: [
          {
            name: 'Alert level',
            yAxis: this.config.num_events
          }
        ]
      };
    },
    async validate() {
      try {
        await this.$refs.form.validate();
        return this.config;
      } catch (error) {
        return false;
      }
    },
    toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced;
    },
    updateQueryKey(val) {
      if (val === '') {
        Vue.delete(this.config, 'query_key');
      }
    },
    updateTermsSize(val) {
      if (val) {
        Vue.set(this.config, 'terms_size', 50);
      } else {
        delete this.config.terms_size;
      }
    },
    updateNumEvents(e) {
      this.config.num_events = e.target.value;
      this.updateMarkLine();
    }
  }
};
</script>

<style lang="scss" scoped>
.chart-controls {
  label {
    margin-right: 15px;
  }
}
</style>
