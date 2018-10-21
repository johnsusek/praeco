<template>
  <el-form
    ref="form"
    :model="$store.state.config.match"
    label-position="top"
    @submit.native.prevent>
    <el-form-item label="Number of events" prop="numEvents" required>
      <el-input
        :controls="false"
        v-model="numEvents"
        min="1"
        type="number" />
      <label>The number of events which will trigger an alert, inclusive.</label>
    </el-form-item>

    <el-form-item label="Timeframe" props="timeframe" required>
      <ElastalertTimePicker
        v-if="timeframe"
        :unit="Object.keys(timeframe)[0]"
        :amount="Object.values(timeframe)[0]"
        @input="updateTimeframe" />
      <label>The time that the number of events must occur within.</label>
    </el-form-item>

    <el-button
      v-if="showAdvanced"
      type="text"
      @click="showAdvanced = !showAdvanced">
      <i class="el-icon-caret-bottom" />
      Hide advanced options
    </el-button>
    <el-button v-else type="text" @click="showAdvanced = !showAdvanced">
      <i class="el-icon-caret-right" />
      Show advanced options
    </el-button>

    <template v-if="showAdvanced">
      <el-form-item label="Use count query">
        <el-switch :disabled="useTermsQuery" v-model="useCountQuery" />
        <label>
          If true, ElastAlert will poll Elasticsearch using the count api,
          and not download all of the matching documents.
          This is useful is you care only about numbers and not the actual data.
          It should also be used if you expect a large number of query hits, in the order of
          tens of thousands or more.
        </label>
      </el-form-item>

      <el-form-item label="Use terms query">
        <el-switch :disabled="useCountQuery" v-model="useTermsQuery" />
        <label>
          If true, ElastAlert will make an aggregation query against Elasticsearch
          to get counts of documents matching each unique value of "query key". This
          must be used with "query key" and "doc type". This will only return a maximum
          of "terms size", default 50, unique terms.
        </label>
      </el-form-item>

      <el-form-item v-if="useTermsQuery" label="Terms size">
        <el-input v-model="termsSize" type="number" />
        <label>
          When used with "use terms query", this is the maximum number of terms returned
          per query. Default is 50.
        </label>
      </el-form-item>

      <el-form-item
        v-if="useCountQuery || useTermsQuery"
        label="Doc type"
        prop="docType"
        required>
        <el-select v-model="docType" filterable clearable placeholder="">
          <el-option v-for="type in types" :key="type" :label="type" :value="type"/>
        </el-select>
        <label>
          Specify the _type of document to search for.
          This must be present if "use count query" or "use terms query" is set.
        </label>
      </el-form-item>

      <el-form-item :required="useTermsQuery" prop="queryKey" label="Query key">
        <el-select v-model="queryKey" filterable clearable placeholder="">
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
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      showAdvanced: false,
    };
  },

  computed: {
    types() {
      return this.$store.getters['metadata/typesForCurrentConfig'];
    },

    fields() {
      return this.$store.getters['metadata/fieldsForCurrentConfig'];
    },

    termsSize: {
      get() {
        return this.$store.state.config.match.termsSize;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_TERMS_SIZE', value);
      }
    },

    useCountQuery: {
      get() {
        return this.$store.state.config.match.useCountQuery;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_USE_COUNT_QUERY', value);
      }
    },

    useTermsQuery: {
      get() {
        return this.$store.state.config.match.useTermsQuery;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_USE_TERMS_QUERY', value);
      }
    },

    numEvents: {
      get() {
        return this.$store.state.config.match.numEvents;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_NUM_EVENTS', value);
      }
    },

    queryKey: {
      get() {
        return this.$store.state.config.match.queryKey;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_QUERY_KEY', value);
      }
    },

    docType: {
      get() {
        return this.$store.state.config.match.docType;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_DOC_TYPE', value);
      }
    },

    timeframe: {
      get() {
        return this.$store.state.config.match.timeframe;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_TIMEFRAME', value);
      }
    }
  },

  methods: {
    updateTimeframe(value) {
      this.timeframe = value;
    }
  }
};
</script>
