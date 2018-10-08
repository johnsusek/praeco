<template>
  <el-form ref="form" :model="form" label-position="top" @submit.native.prevent>
    <br>

    <el-form-item label="Number of events" prop="numEvents" required>
      <el-input
        :min="1"
        :controls="false"
        v-model="form.numEvents"
        type="number"
        @input="updateMarkLine" />
      <label>The number of events which will trigger an alert, inclusive.</label>
    </el-form-item>

    <el-form-item label="Timeframe" props="timeframe" required>
      <ElastalertTimePicker v-model="form.timeframe" />
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
        <el-switch
          :disabled="form.useTermsQuery"
          v-model="form.useCountQuery"
          @input="updateCountQuery" />
        <label>
          If true, ElastAlert will poll Elasticsearch using the count api,
          and not download all of the matching documents.
          This is useful is you care only about numbers and not the actual data.
          It should also be used if you expect a large number of query hits, in the order of
          tens of thousands or more.
        </label>
      </el-form-item>

      <el-form-item label="Use terms query">
        <el-switch
          :disabled="form.useCountQuery"
          v-model="form.useTermsQuery"
          @input="updateTermsQuery" />
        <label>
          If true, ElastAlert will make an aggregation query against Elasticsearch
          to get counts of documents matching each unique value of "query key". This
          must be used with "query key" and "doc type". This will only return a maximum
          of "terms size", default 50, unique terms.
        </label>
      </el-form-item>

      <el-form-item v-if="form.useTermsQuery" label="Terms size">
        <el-input v-model="form.termsSize" type="number" />
        <label>
          When used with "use terms query", this is the maximum number of terms returned
          per query. Default is 50.
        </label>
      </el-form-item>

      <el-form-item
        v-if="form.useCountQuery || form.useTermsQuery"
        required
        label="Doc type"
        prop="docType">
        <el-select
          v-model="form.docType"
          filterable
          clearable
          placeholder=""
          @input="updateDocType">
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

      <el-form-item :required="form.useTermsQuery" prop="queryKey" label="Query key">
        <el-select
          v-model="form.queryKey"
          filterable
          clearable
          placeholder=""
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
    </template>

    <hr>

    <el-form-item label="Frequency visualizer" >
      <ESChart
        :mark-line="markLine"
        :timeframe="{ hours: 24 }"
        :bucket="form.timeframe"
        :query="query"
        :index="wildcardIndex" />
    </el-form-item>
  </el-form>
</template>

<script>
import Vue from 'vue';
import { validateForm } from '@/mixins/validateForm';

export default {
  mixins: [validateForm],

  props: [
    'index',
    'strftime',
    'timeframe',
    'useCountQuery',
    'useTermsQuery',
    'termsSize',
    'queryKey',
    'docType',
    'query',
    'fields',
    'types',
    'numEvents'
  ],

  data() {
    return {
      showAdvanced: false,
      markLine: {},
      form: {}
    };
  },

  computed: {
    wildcardIndex() {
      let formattedIndex = this.index;

      if (this.strftime) {
        formattedIndex = formattedIndex.replace(/%[Ymd]/g, '*');
      }

      return formattedIndex;
    }
  },

  mounted() {
    if (this.numEvents) {
      Vue.set(this.form, 'numEvents', this.numEvents);
    } else {
      Vue.set(this.form, 'numEvents', 1);
    }

    if (this.timeframe) {
      Vue.set(this.form, 'timeframe', this.timeframe);
    } else {
      Vue.set(this.form, 'timeframe', { minutes: 10 });
    }

    if (this.useCountQuery) {
      Vue.set(this.form, 'useCountQuery', this.useCountQuery);
    }

    if (this.useTermsQuery) {
      Vue.set(this.form, 'useTermsQuery', this.useTermsQuery);
    }

    if (this.termsSize) {
      Vue.set(this.form, 'termsSize', this.termsSize);
    }

    if (this.queryKey) {
      Vue.set(this.form, 'queryKey', this.queryKey);
    }

    if (this.docType) {
      Vue.set(this.form, 'docType', this.docType);
    }

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
            yAxis: this.form.numEvents
          },
        ]
      };
    },

    toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced;
    },

    updateDocType(val) {
      if (val === '') {
        Vue.delete(this.form, 'docType');
      }
    },

    updateQueryKey(val) {
      if (val === '') {
        Vue.delete(this.form, 'queryKey');
      }
    },

    updateCountQuery(val) {
      if (!val) {
        Vue.delete(this.form, 'useCountQuery');
      }
    },

    updateTermsQuery(val) {
      if (!val) {
        Vue.delete(this.form, 'useTermsQuery');
      }
    },

    updateTermsSize(val) {
      if (!val) {
        Vue.delete(this.form, 'termsSize');
      }
    }
  }
};
</script>
