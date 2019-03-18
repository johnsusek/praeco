<template>
  <div>
    <el-popover v-model="popWhenVisible">
      <span slot="reference" class="pop-trigger">
        <span>WHEN </span>
        <span>{{ metricAggType === 'avg' ? 'average' : metricAggType }}</span>
      </span>
      <div>
        <el-menu mode="vertical" @select="selectWhen">
          <el-menu-item index="count">count</el-menu-item>
          <el-menu-item index="avg">average</el-menu-item>
          <el-menu-item index="sum">sum</el-menu-item>
          <el-menu-item index="min">min</el-menu-item>
          <el-menu-item index="max">max</el-menu-item>
          <el-menu-item index="field in list">field in list</el-menu-item>
          <el-menu-item index="field not in list">field not in list</el-menu-item>
          <el-menu-item index="field changes">field changes</el-menu-item>
          <el-menu-item index="new term">new term</el-menu-item>
        </el-menu>
      </div>
    </el-popover>

    <el-popover v-if="showPopOf" :class="{ 'is-invalid': !popOfValid }" v-model="popOfVisible">
      <span slot="reference" class="pop-trigger">
        <span>OF </span>
        <span>{{ metricAggKey || 'select a field' }}</span>
      </span>
      <el-form ref="of" :model="$store.state.config.match">
        <el-form-item prop="metricAggKey" required>
          <el-select
            v-model="metricAggKey"
            filterable
            clearable
            placeholder="Select field"
            @input="popOfVisible = false; validate();">
            <el-option
              v-for="field in Object.keys(numberFields)"
              :key="field"
              :label="field"
              :value="field" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-popover>

    <el-popover v-if="showPopOver" :class="{ 'is-invalid': !popOverValid }" v-model="popOverVisible">
      <span slot="reference" class="pop-trigger">
        <span>
          <span v-if="groupedOver === 'field'">GROUPED </span>
          <span>OVER </span>
        </span>
        <span v-if="groupedOver === 'all'">all documents</span>
        <span v-if="groupedOver === 'field'">{{ queryKey }}</span>
      </span>
      <div>
        <el-radio
          id="groupedOverAll"
          v-model="groupedOver"
          label="all"
          border
          @change="changeGroupedOver">
          All documents
        </el-radio>
        <el-radio
          id="groupedOverField"
          v-model="groupedOver"
          label="field"
          border
          @change="changeGroupedOver">Field</el-radio>
        <div v-if="groupedOver === 'all' && type === 'metric_aggregation'">
          <el-form ref="overall" :model="$store.state.config.match">
            <el-form-item label="" prop="docType" required>
              <el-select
                v-model="docType"
                filterable
                clearable
                class="el-select-wide m-n-sm"
                placeholder="Select doc type"
                @change="validate">
                <el-option v-for="type in types" :key="type" :label="type" :value="type"/>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="groupedOver === 'field'">
          <el-form ref="over" :model="$store.state.config.match">
            <el-form-item prop="queryKey" required>
              <el-select
                v-model="queryKey"
                filterable
                clearable
                placeholder="Select field"
                class="el-select-wide m-n-sm"
                style="width: 280px"
                @input="popOverVisible = false; validate();">
                <el-option-group label="Date">
                  <el-option
                    v-for="field in Object.keys(dateFields)"
                    :key="field"
                    :label="field"
                    :value="field" />
                </el-option-group>
                <el-option-group label="Text">
                  <el-option
                    v-for="field in Object.keys(textFields)"
                    :key="field"
                    :label="field"
                    :value="field" />
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-popover>

    <el-popover v-if="showPopCompare" :class="{ 'is-invalid': !popCompareValid }" v-model="popCompareVisible">
      <span slot="reference" class="pop-trigger">
        <template v-if="compareKey && compareKey.length > 1">
          <span>FIELDS</span>
          <span> {{ compareKey }}</span>
        </template>
        <template v-else-if="compareKey && compareKey.length === 1">
          <span>FIELD</span>
          <span> {{ compareKey[0] }}</span>
        </template>
        <template v-else>
          <span>FIELD</span>
          <span> {{ compareKey }}</span>
        </template>
      </span>
      <el-form ref="compare" :model="$store.state.config.match">
        <el-form-item prop="compareKey" required>
          <el-select
            v-model="compareKey"
            :multiple="metricAggType === 'field changes'"
            :filterable="metricAggType !== 'field changes'"
            clearable
            placeholder="Field"
            style="width: 280px"
            @input="popCompareVisible = false; validate();">
            <template v-if="['field in list', 'field not in list'].includes(metricAggType)">
              <el-option
                v-for="field in Object.keys(textFields)"
                :key="field"
                :label="field"
                :value="field" />
            </template>
            <template v-else>
              <el-option
                v-for="field in Object.keys(fields)"
                :key="field"
                :label="field"
                :value="field" />
            </template>
          </el-select>
          <label v-if="metricAggType === 'field changes'">The field to check for changes.</label>
        </el-form-item>
      </el-form>
    </el-popover>

    <el-popover v-if="showPopGroup" :class="{ 'is-invalid': !popGroupValid }" v-model="popGroupVisible">
      <span slot="reference" class="pop-trigger">
        <span>
          <span v-if="metricAggType === 'new term'">IN FIELD </span>
          <span v-else>GROUPED OVER </span>
        </span>
        <span>{{ queryKey }}</span>
      </span>
      <el-form ref="group" :model="$store.state.config.match">
        <el-form-item prop="queryKey" required>
          <el-select
            v-model="queryKey"
            filterable
            clearable
            placeholder="Select field"
            class="el-select-wide"
            style="width: 280px"
            @input="popGroupVisible = false; validate();">
            <el-option-group label="Date">
              <el-option
                v-for="field in Object.keys(dateFields)"
                :key="field"
                :label="field"
                :value="field" />
            </el-option-group>
            <el-option-group label="Text">
              <el-option
                v-for="field in Object.keys(textFields)"
                :key="field"
                :label="field"
                :value="field" />
            </el-option-group>
          </el-select>
          <label v-if="metricAggType === 'field changes'">Field change will be checked per-group.</label>
        </el-form-item>
      </el-form>
    </el-popover>

    <el-popover v-if="showPopBlacklist" :class="{ 'is-invalid': !popBlacklistValid }" v-model="popBlacklistVisible">
      <span slot="reference" class="pop-trigger">
        <el-tooltip v-if="blacklist.length" :content="blacklist.join(', ')" placement="top">
          <span>IN LIST ({{ blacklist.length }})</span>
        </el-tooltip>
        <span v-else>IN LIST ({{ blacklist.length }})</span>
      </span>
      <template>
        <el-form
          ref="blacklist"
          :model="$store.state.config.match"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in blacklist"
            :key="index"
            :prop="'blacklist.' + index"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="blacklist[index]"
                  placeholder="Keyword"
                  @input="(val) => updateBlacklist(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removeBlacklistEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button class="m-n-sm" @click="addBlacklistEntry">Add keyword</el-button>
      </template>
    </el-popover>

    <el-popover v-if="showPopWhitelist" :class="{ 'is-invalid': !popWhitelistValid }" v-model="popWhitelistVisible">
      <span slot="reference" class="pop-trigger">
        <el-tooltip v-if="whitelist.length" :content="whitelist.join(', ')" placement="top">
          <span>NOT IN LIST ({{ whitelist.length }})</span>
        </el-tooltip>
        <span v-else>NOT IN LIST ({{ whitelist.length }})</span>
      </span>
      <template>
        <el-form
          ref="whitelist"
          :model="$store.state.config.match"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in whitelist"
            :key="index"
            :prop="'whitelist.' + index"
            required
            class="el-form-item-list"
            label="">
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="whitelist[index]"
                  placeholder="Keyword"
                  @input="(val) => updateWhitelist(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click.prevent="removeWhitelistEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button class="m-n-sm" @click="addWhitelistEntry">Add keyword</el-button>
      </template>
    </el-popover>

    <span class="pop-trigger" @click="popFilterVisible = true">
      <span v-if="queryString === defaultFilter">UNFILTERED</span>
      <span v-else>WITH FILTER</span>
      <span v-if="queryString !== defaultFilter"> {{ queryString }}</span>
    </span>

    <el-dialog :visible.sync="popFilterVisible" :show-close="false" fullscreen>
      <el-button type="primary" plain class="close-button" @click="popFilterVisible = false">Done</el-button>
      <ConfigQuery ref="query" class="config-query" />
    </el-dialog>

    <el-popover v-if="showPopAbove" :class="{ 'is-invalid': !popAboveValid }" v-model="popAboveVisible">
      <span v-if="spikeOrThreshold === 'is' || metricAggType !== 'count'" slot="reference" class="pop-trigger">
        <span>IS</span>
        <span v-if="numEvents || maxThreshold">
          ABOVE {{ metricAggType === 'count' ? numEvents : maxThreshold }}
        </span>
        <span v-if="(numEvents && threshold) || (maxThreshold && minThreshold)">
          &amp;
        </span>
        <span v-if="threshold || minThreshold">
          BELOW {{ metricAggType === 'count' ? threshold : minThreshold }}
        </span>
      </span>

      <span v-else-if="spikeOrThreshold === 'spike'" slot="reference" class="pop-trigger">
        <span>SPIKES</span>
        <span v-if="spikeType === 'up'">
          UP
        </span>
        <span v-if="spikeType === 'down'">
          DOWN
        </span>
        <span v-if="spikeType === 'both'">
          EITHER DIRECTION
        </span>
        {{ spikeHeight }}x
      </span>

      <span v-else-if="spikeOrThreshold === 'any'" slot="reference" class="pop-trigger">
        <span>IS NOT EMPTY</span>
      </span>

      <div v-if="metricAggType === 'count'">
        <el-row :gutter="10" style="width: 360px">
          <el-col :span="spikeOrThreshold === 'any' ? 24 : 8">
            <el-select
              id="spikeOrThreshold"
              v-model="spikeOrThreshold"
              class="el-select-wide"
              @input="updateSpikeOrThreshold">
              <el-option key="any" label="Is not empty" value="any" />
              <el-option key="is" label="Is" value="is" />
              <el-option key="spike" label="Spikes" value="spike" />
            </el-select>
          </el-col>

          <el-col v-if="spikeOrThreshold !== 'any'" :span="8">
            <el-select
              v-if="spikeOrThreshold === 'is'"
              id="aboveOrBelow"
              v-model="aboveOrBelow"
              class="el-select-wide"
              @input="updateAboveOrBelow">
              <el-option key="above" label="Above" value="above" />
              <el-option key="below" label="Below" value="below" />
            </el-select>
            <el-select v-else v-model="spikeType" class="el-select-wide">
              <el-option label="Up" value="up" />
              <el-option label="Down" value="down" />
              <el-option label="Both" value="both" />
            </el-select>
          </el-col>

          <el-col v-if="spikeOrThreshold !== 'any'" :span="8">
            <el-form ref="spikeOrThreshold" :model="$store.state.config.match">
              <template v-if="spikeOrThreshold === 'is'" >
                <el-form-item v-if="aboveOrBelow === 'above'" prop="numEvents" required>
                  <el-input
                    id="numEvents"
                    v-model="numEvents"
                    min="1"
                    type="number"
                    class="el-input-wide"
                    @input="validate" />
                </el-form-item>
                <el-form-item v-else prop="threshold" required>
                  <el-input
                    id="threshold"
                    v-model="threshold"
                    min="1"
                    type="number"
                    class="el-input-wide"
                    @input="validate" />
                </el-form-item>
              </template>
              <el-form-item v-else prop="spikeHeight" required>
                <el-input
                  id="spikeHeight"
                  v-model="spikeHeight"
                  type="number"
                  class="el-input-wide"
                  @input="validate" />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>

      <div v-else>
        <el-form ref="aboveOrBelow" :rules="aboveOrBelowRules" :model="$store.state.config.match" label-width="60px">
          <el-form-item label="Above" prop="maxThreshold">
            <el-input id="maxThreshold" v-model="maxThreshold" min="1" type="number" @change="validate" />
          </el-form-item>
          <el-form-item label="Below" prop="minThreshold">
            <el-input id="minThreshold" v-model="minThreshold" min="1" type="number" @change="validate" />
          </el-form-item>
        </el-form>
      </div>
    </el-popover>

    <span v-show="showTime">
      <el-popover
        v-show="metricAggType === 'count' || metricAggType === 'field changes'"
        popper-class="popover-time">
        <span
          slot="reference"
          class="pop-trigger">
          <span>
            <span v-if="metricAggType === 'field changes'">
              WITHIN
              <span v-if="!useTimeframe">ANY TIMEFRAME</span>
            </span>
            <span v-if="metricAggType === 'count'">FOR </span>
            <span v-if="useTimeframe">THE LAST</span>
          </span>
          <ElastalertTimeView
            v-if="useTimeframe"
            :time="timeframe"/>
        </span>

        <el-form v-if="metricAggType === 'field changes'" :class="{ 'm-s-lg': useTimeframe }">
          <el-form-item label="Limit timeframe">
            <el-switch v-model="useTimeframe" />
            <label>
              By default, the change rule type has no maximum time limit between changes.
              Enable this option to check for a change within a limited time window.
            </label>
          </el-form-item>
        </el-form>
        <div v-if="useTimeframe">
          <ElastalertTimePicker
            id="timeframe"
            :unit="Object.keys(timeframe)[0]"
            :amount="Object.values(timeframe)[0]"
            @input="updateTimeframe"/>
          <label v-if="metricAggType === 'field changes'">
            The maximum time between changes.
            After this time period, elastalert will forget the old
            value of the {{ compareKey }} field.
          </label>
        </div>
      </el-popover>

      <el-popover v-show="metricAggType !== 'count' && metricAggType !== 'field changes'">
        <span slot="reference" class="pop-trigger-pseudo">
          <span>FOR THE LAST </span>
          <ElastalertTimeView :time="bufferTime" />
        </span>
      </el-popover>
    </span>

    <el-popover
      v-if="showOptions"
      ref="optionsPop"
      v-model="popOptionsVisible"
      :class="{ 'is-invalid': !popOptionsValid }"
      popper-class="popover-options">
      <span slot="reference" class="pop-trigger">
        <span>WITH OPTIONS</span>
      </span>

      <div v-if="metricAggType === 'field not in list' || metricAggType === 'field changes'">
        <el-form
          ref="form"
          :model="$store.state.config.match"
          label-position="top"
          @submit.native.prevent>
          <el-form-item label="Ignore null">
            <el-switch v-model="ignoreNull" />
            <label>If set, events without the selected field will not match.</label>
          </el-form-item>
        </el-form>
      </div>

      <div v-if="metricAggType === 'new term'">
        <el-form
          ref="form"
          :model="$store.state.config.match"
          label-position="top"
          @submit.native.prevent>
          <el-form-item label="Terms window">
            <ElastalertTimePicker
              id="termsWindowSize"
              :unit="Object.keys(termsWindowSize)[0]"
              :amount="Object.values(termsWindowSize)[0]"
              @input="updateTermsWindowSize"/>
            <label>
              The amount of time used for the initial query to find existing terms.
              No term that has occurred within this time frame will trigger an alert.
              The default is 30 days.
            </label>
          </el-form-item>

          <el-form-item label="Window step">
            <ElastalertTimePicker
              id="windowStepSize"
              :unit="Object.keys(windowStepSize)[0]"
              :amount="Object.values(windowStepSize)[0]"
              @input="updateWindowStepSize"/>
            <label>
              When querying for existing terms, split up the time range into steps of this size.
              For example, using the default 30 day window size, and the default 1 day step size,
              30 invidivdual queries will be made.
              This helps to avoid timeouts for very expensive aggregation queries.
              The default is 1 day.
            </label>
          </el-form-item>

          <el-form-item label="Alert on missing field">
            <el-switch v-model="alertOnMissingField" />
            <label>Whether or not to alert when a field is missing from a document.</label>
          </el-form-item>
        </el-form>
      </div>

      <div v-if="type === 'frequency' || type === 'flatline' || type === 'spike' || type === 'new_term'">
        <el-form
          ref="freqFlatlineOptions"
          :model="$store.state.config.match"
          label-position="top"
          @submit.native.prevent>
          <template v-if="type !== 'new_term'">
            <el-form-item label="Use count query">
              <el-switch
                id="useCountQuery"
                :disabled="useTermsQuery"
                v-model="useCountQuery"
                @input="refreshOptionsPop" />
              <label>
                If true, ElastAlert will poll Elasticsearch using the count api,
                and not download all of the matching documents.
                This is useful is you care only about numbers and not the actual data.
                It should also be used if you expect a large number of query hits, in the order of
                tens of thousands or more.
              </label>
            </el-form-item>
          </template>

          <el-form-item v-if="type !== 'spike'" :class="{ 'm-n-sm': type === 'new_term' }" label="Use terms query">
            <el-switch :disabled="useCountQuery" v-model="useTermsQuery" @input="refreshOptionsPop" />
            <label v-if="type === 'new_term'">
              If true, ElastAlert will use aggregation queries to get terms instead of regular search queries.
              This is faster than regular searching if there is a large number of documents.
              <span v-if="useTermsQuery">
                When using use_terms_query, make sure that the field you are using is not analyzed.
                If it is, the results of each terms query may return tokens rather than full values.
                ElastAlert will by default turn on use_keyword_postfix, which attempts to use the non-analyzed version
                (.keyword or .raw) to gather initial terms. These will not match the partial values and result
                in false positives.
              </span>
            </label>
            <label v-else>
              If true, ElastAlert will make an aggregation query against Elasticsearch
              to get counts of documents matching each unique value of "query key". This
              must be used with "query key" and "doc type". This will only return a maximum
              of "terms size", default 50, unique terms.
            </label>
          </el-form-item>

          <el-form-item
            v-if="useCountQuery || useTermsQuery"
            label="Doc type"
            prop="docType"
            required>
            <el-select
              id="docType"
              v-model="docType"
              filterable
              clearable
              placeholder=""
              @change="validateFreqFlatlineOptions">
              <el-option v-for="type in types" :key="type" :label="type" :value="type"/>
            </el-select>
            <label>
              Specify the _type of document to search for.
              This must be present if "use count query" or "use terms query" is set.
            </label>
          </el-form-item>

          <el-form-item v-if="useTermsQuery" label="Terms size">
            <el-input v-model="termsSize" type="number" />
            <label v-if="type === 'new_term'">
              This means that if a new term appears but there are at least this many terms which
              appear more frequently, it will not be found. Default is 50.
            </label>
            <label v-else>
              When used with "use terms query", this is the maximum number of terms returned
              per query. Default is 50.
            </label>
          </el-form-item>

          <el-form-item label="Use keyword postfix">
            <el-switch id="useKeywordPostfix" v-model="useKeywordPostfix" />
            <label>
              If true, ElastAlert will automatically try to add .keyword (ES5+) or
              .raw to the fields when making an initial query.
              These are non-analyzed fields added by Logstash.
              If the field used is analyzed, the initial query will return only the tokenized values,
              potentially causing false positives. Defaults to true.
            </label>
          </el-form-item>
        </el-form>
      </div>

      <div v-if="type === 'spike'">
        <el-form
          :model="$store.state.config.match"
          label-position="top"
          class="m-n-lg"
          @submit.native.prevent>
          <el-form-item label="Threshold (reference)" prop="thresholdRef">
            <el-input v-model="thresholdRef" type="number" />
            <label>
              The minimum number of events that must exist in the
              reference window for an alert to trigger.
              For example, if "spike height" is 3 and "threshold reference" is 10,
              then the ‘reference’ window must contain
              at least 10 events and the ‘current’ window at least
              30 events for an alert to be triggered.
            </label>
          </el-form-item>

          <el-form-item label="Threshold (current)" prop="thresholdCur">
            <el-input v-model="thresholdCur" type="number" />
            <label>
              The minimum number of events that must exist in the current
              window for an alert to trigger.
              For example, if 'spike height' is 3 and 'threshold current' is 60, then an alert
              will occur if the current window has more than 60 events and the reference
              window has less than 20.
            </label>
          </el-form-item>
        </el-form>
      </div>
    </el-popover>

    <el-alert
      v-if="bigBuckets && !useCountQuery && metricAggType === 'count'"
      :closable="false"
      class="m-n-med"
      type="warning"
      title="Large data size detected"
      show-icon>
      <div>
        This rule is processing large amounts of data and should use the
        "Use count query" option under "WITH OPTIONS" to avoid high CPU usage.
      </div>
    </el-alert>

    <ESChart
      v-if="showChart"
      :index="$store.state.config.settings.index"
      :query="queryString"
      :timeframe="chartTimeframe"
      :bucket="bucket"
      :mark-line="$store.getters['config/match/markLine']"
      :spike-height="$store.getters['config/match/spikeHeight']"
      :show-axis-pointer="false"
      :group-by="groupedOver === 'field' && queryKey"
      :agg-avg="metricAggType === 'avg' && metricAggKey"
      :agg-sum="metricAggType === 'sum' && metricAggKey"
      :agg-min="metricAggType === 'min' && metricAggKey"
      :agg-max="metricAggType === 'max' && metricAggKey"
      class="m-n-med"
      @click="clickChart"
      @update="handleUpdateData"
      @group="val => groupByValue = val" />

    <el-dialog :visible.sync="eventViewerVisible" title="Event viewer" fullscreen custom-class="event-table-dialog">
      <EventTable
        v-if="eventViewerFrom"
        :group-by-field="queryKey"
        :group-by-value="groupByValue"
        :from="eventViewerFrom"
        :timeframe="timeframe"
        :height="eventTableHeight" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bigBuckets: false,
      groupByValue: '',
      eventViewerFrom: '',
      eventViewerVisible: false,
      popWhenVisible: false,
      popOverVisible: false,
      popGroupVisible: false,
      popFilterVisible: false,
      popOptionsVisible: false,
      popCompareVisible: false,
      popBlacklistVisible: false,
      popWhitelistVisible: false,
      popOfVisible: false,
      groupedOver: 'all',
      popAboveVisible: false,
      aboveOrBelow: 'above',
      spikeOrThreshold: 'is',
      popOfValid: true,
      popOverValid: true,
      popCompareValid: true,
      popGroupValid: true,
      popBlacklistValid: true,
      popWhitelistValid: true,
      popAboveValid: true,
      popOptionsValid: true,
      aboveOrBelowRules: {
        maxThreshold: [
          { validator: this.validateMaxThreshold, trigger: 'change' }
        ],
        minThreshold: [
          { validator: this.validateMinThreshold, trigger: 'change' }
        ]
      }
    };
  },

  computed: {
    chartTimeframe() {
      if (!this.bucket) return {};

      if (typeof this.bucket === 'object' && Object.keys(this.bucket).length) {
        return {
          [Object.keys(this.bucket)[0]]: Object.values(this.bucket)[0] * 100
        };
      }
    },

    eventTableHeight() {
      return document.body.clientHeight - 85;
    },

    useTimeframe: {
      get() {
        return this.$store.state.config.match.useTimeframe;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_USE_TIMEFRAME', value);
      }
    },

    thresholdRef: {
      get() {
        return this.$store.state.config.match.thresholdRef;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_THRESHOLD_REF', value);
      }
    },

    thresholdCur: {
      get() {
        return this.$store.state.config.match.thresholdCur;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_THRESHOLD_CUR', value);
      }
    },

    termsSize: {
      get() {
        return this.$store.state.config.match.termsSize;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_TERMS_SIZE', value);
      }
    },

    types() {
      return this.$store.getters['metadata/typesForCurrentConfig'];
    },

    docType: {
      get() {
        return this.$store.state.config.match.docType;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_DOC_TYPE', value);
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

    ignoreNull: {
      get() {
        return this.$store.state.config.match.ignoreNull;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_IGNORE_NULL', value);
      }
    },

    termsWindowSize: {
      get() {
        return this.$store.state.config.match.termsWindowSize;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_TERMS_WINDOW_SIZE', value);
      }
    },

    windowStepSize: {
      get() {
        return this.$store.state.config.match.windowStepSize;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_WINDOW_STEP_SIZE', value);
      }
    },

    alertOnMissingField: {
      get() {
        return this.$store.state.config.match.alertOnMissingField;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_ALERT_ON_MISSING_FIELD', value);
      }
    },

    index() {
      return this.$store.state.config.settings.index;
    },

    blacklist() {
      return this.$store.state.config.match.blacklist;
    },

    whitelist() {
      return this.$store.state.config.match.whitelist;
    },

    compareKey: {
      get() {
        if (this.$store.state.config.match.compareKey) {
          return this.$store.state.config.match.compareKey;
        } else if (this.metricAggType === 'field changes') {
          return [];
        }
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_COMPARE_KEY', value);
      }
    },

    useKeywordPostfix: {
      get() {
        return this.$store.state.config.match.useKeywordPostfix;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_USE_KEYWORD_POSTFIX', value);
      }
    },

    showChart() {
      return !['field changes', 'field in list', 'field not in list'].includes(this.metricAggType);
    },

    showOptions() {
      let shouldShowOptions = ['field not in list', 'field changes', 'new term'].includes(this.metricAggType);
      let shouldShowOptionsSt =
        this.metricAggType === 'count' && this.spikeOrThreshold !== 'any';

      return shouldShowOptions || shouldShowOptionsSt;
    },

    showPopOf() {
      return (
        this.metricAggType !== 'count' && this.metricAggType !== 'new term' &&
        !['field changes', 'field in list', 'field not in list'].includes(this.metricAggType)
      );
    },

    showPopOver() {
      return (
        this.spikeOrThreshold !== 'any' &&
        !['field changes', 'field in list', 'field not in list', 'new term'].includes(this.metricAggType)
      );
    },

    showPopAbove() {
      return !['field changes', 'field in list', 'field not in list', 'new term'].includes(this.metricAggType);
    },

    showPopCompare() {
      return ['field changes', 'field in list', 'field not in list'].includes(this.metricAggType);
    },

    showPopGroup() {
      return this.metricAggType === 'field changes' || this.metricAggType === 'new term';
    },

    showPopBlacklist() {
      return this.metricAggType === 'field in list';
    },

    showPopWhitelist() {
      return this.metricAggType === 'field not in list';
    },

    showTime() {
      return (
        !['field in list', 'field not in list', 'new term'].includes(this.metricAggType) &&
        this.spikeOrThreshold !== 'any'
      );
    },

    queryTree: {
      get() {
        return this.$store.state.config.query.tree;
      },
      set(value) {
        this.$store.commit('config/query/UPDATE_TREE', value);
      }
    },

    spikeHeight: {
      get() {
        return this.$store.state.config.match.spikeHeight;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_SPIKE_HEIGHT', value);
      }
    },

    spikeType: {
      get() {
        return this.$store.state.config.match.spikeType;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_SPIKE_TYPE', value);
      }
    },

    bucket() {
      if (this.metricAggType === 'count') {
        return this.timeframe;
      }
      return this.bufferTime;
    },

    bufferTime() {
      return this.$store.state.elastalert.bufferTime;
    },

    threshold: {
      get() {
        return this.$store.state.config.match.threshold;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_THRESHOLD', value);
      }
    },

    timeframe: {
      get() {
        return this.$store.state.config.match.timeframe;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_TIMEFRAME', value);
      }
    },

    metricAggKey: {
      get() {
        return this.$store.state.config.match.metricAggKey;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_METRIC_AGG_KEY', value);
      }
    },

    metricAggType: {
      get() {
        return this.$store.state.config.match.metricAggType;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_METRIC_AGG_TYPE', value);
      }
    },

    maxThreshold: {
      get() {
        return this.$store.state.config.match.maxThreshold;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_MAX_THRESHOLD', value);
      }
    },

    minThreshold: {
      get() {
        return this.$store.state.config.match.minThreshold;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_MIN_THRESHOLD', value);
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

    numEvents: {
      get() {
        return this.$store.state.config.match.numEvents;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_NUM_EVENTS', value);
      }
    },

    type: {
      get() {
        return this.$store.state.config.match.type;
      },
      set(value) {
        this.$store.commit('config/match/UPDATE_TYPE', value);
      }
    },

    timeField() {
      return this.$store.state.config.settings.timeField;
    },

    queryString() {
      return (
        this.$store.getters['config/query/queryString'] || this.defaultFilter
      );
    },

    numberFields() {
      return this.$store.getters['metadata/numberFieldsForCurrentConfig'];
    },

    textFields() {
      return this.$store.getters['metadata/textFieldsForCurrentConfig'];
    },

    dateFields() {
      return this.$store.getters['metadata/dateFieldsForCurrentConfig'];
    },

    fields() {
      return this.$store.getters['metadata/fieldsForCurrentConfig'];
    },

    defaultFilter() {
      return `${this.timeField}:*`;
    }
  },

  mounted() {
    this.$nextTick(() => {
      if (this.type === 'frequency') {
        this.aboveOrBelow = 'above';
        this.metricAggType = 'count';
      } else if (this.type === 'flatline') {
        this.aboveOrBelow = 'below';
        this.metricAggType = 'count';
      } else if (this.type === 'any') {
        this.metricAggType = 'count';
        this.spikeOrThreshold = 'any';
      } else if (this.type === 'blacklist') {
        this.metricAggType = 'field in list';
      } else if (this.type === 'whitelist') {
        this.metricAggType = 'field not in list';
      } else if (this.type === 'change') {
        this.metricAggType = 'field changes';
      } else if (this.type === 'spike') {
        this.metricAggType = 'count';
        this.spikeOrThreshold = 'spike';
      } else if (this.type === 'new_term') {
        this.metricAggType = 'new term';
      }

      // if rule supports queryKey, set groupedOver to field
      if (
        this.queryKey &&
        ['metric_aggregation', 'frequency', 'flatline',
          'change', 'spike', 'flatline'].includes(this.type)
      ) {
        this.groupedOver = 'field';
      }

      if (this.metricAggType === 'count') {
        this.useTimeframe = true;
      }

      setTimeout(() => {
        this.validate();
      }, 10);
    });
  },

  methods: {
    handleUpdateData(data) {
      if (!data) return;
      this.bigBuckets = !!data.map(d => d.value).find(v => v > 10000);
    },

    changeGroupedOver() {
      this.validate();

      if (this.groupedOver === 'all') {
        this.groupByValue = '';
        this.queryKey = '';
      }
    },

    clickChart(val) {
      this.eventViewerFrom = val.name;
      this.eventViewerVisible = true;
    },

    async validate() {
      try {
        if (this.$refs.of) {
          await this.validateOf();
        }

        await this.validateOver();
        await this.validateOverall();

        if (this.$refs.compare) {
          await this.validateCompare();
        }

        if (this.$refs.group) {
          await this.validateGroup();
        }

        if (this.$refs.blacklist) {
          await this.validateBlacklist();
        }

        if (this.$refs.whitelist) {
          await this.validateWhitelist();
        }

        if (this.$refs.freqFlatlineOptions) {
          await this.validateFreqFlatlineOptions();
        }

        let aboveValid = await this.validateAbove();
        if (!aboveValid) return false;

        this.$emit('validate', true);
        return true;
      } catch (error) {
        this.$emit('validate', false);
        return false;
      }
    },

    validateMaxThreshold(rule, value, callback) {
      if (!value && !this.minThreshold) {
        callback(new Error('No value and no min threshold'));
      } else {
        callback();
      }
    },

    validateMinThreshold(rule, value, callback) {
      if (!value && !this.maxThreshold) {
        callback(new Error('No value and no max threshold'));
      } else {
        callback();
      }
    },

    async validateFreqFlatlineOptions() {
      try {
        this.popOptionsValid = await this.$refs.freqFlatlineOptions.validate();
      } catch (error) {
        this.popOptionsValid = false;
        throw error;
      }
    },

    async validateCompare() {
      try {
        this.popCompareValid = await this.$refs.compare.validate();
      } catch (error) {
        this.popCompareValid = false;
        throw error;
      }
    },

    async validateAbove() {
      let stValid = true;
      let abValid = true;

      if (this.$refs.spikeOrThreshold) {
        try {
          stValid = await this.$refs.spikeOrThreshold.validate();
        } catch (error) {
          stValid = false;
        }
      }

      if (this.$refs.aboveOrBelow) {
        try {
          abValid = await this.$refs.aboveOrBelow.validate();
        } catch (error) {
          abValid = false;
        }
      }

      this.popAboveValid = stValid && abValid;

      return this.popAboveValid;
    },

    async validateBlacklist() {
      if (!this.blacklist.length) {
        this.popBlacklistValid = false;
        return;
      }

      try {
        this.popBlacklistValid = await this.$refs.blacklist.validate();
      } catch (error) {
        this.popBlacklistValid = false;
        throw error;
      }
    },

    async validateWhitelist() {
      if (!this.whitelist.length) {
        this.popWhitelistValid = false;
        return;
      }

      try {
        this.popWhitelistValid = await this.$refs.whitelist.validate();
      } catch (error) {
        this.popWhitelistValid = false;
        throw error;
      }
    },

    async validateGroup() {
      try {
        this.popGroupValid = await this.$refs.group.validate();
      } catch (error) {
        this.popGroupValid = false;
        throw error;
      }
    },

    async validateOf() {
      try {
        this.popOfValid = await this.$refs.of.validate();
      } catch (error) {
        this.popOfValid = false;
        throw error;
      }
    },

    async validateOver() {
      if (!this.$refs.over) {
        this.popOverValid = true;
        return;
      }

      try {
        this.popOverValid = await this.$refs.over.validate();
      } catch (error) {
        this.popOverValid = false;
        throw error;
      }
    },

    async validateOverall() {
      if (!this.$refs.overall) {
        this.popOverValid = true;
        return;
      }

      try {
        this.popOverValid = await this.$refs.overall.validate();
      } catch (error) {
        this.popOverValid = false;
        throw error;
      }
    },

    toggleThresholdRef(val) {
      if (!val) {
        this.$store.commit('config/match/UPDATE_THRESHOLD_REF', null);
      }
    },

    toggleThresholdCur(val) {
      if (!val) {
        this.$store.commit('config/match/UPDATE_THRESHOLD_CUR', null);
      }
    },

    refreshOptionsPop() {
      this.$nextTick(() => {
        this.$refs.optionsPop.updatePopper();
      });
    },

    updateBlacklist(entry, index) {
      if (Number.isNaN(entry)) return;

      this.$store.commit('config/match/UPDATE_BLACKLIST_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removeBlacklistEntry(entry) {
      this.$store.commit('config/match/REMOVE_BLACKLIST_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addBlacklistEntry() {
      this.$store.commit('config/match/ADD_BLACKLIST_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    updateWhitelist(entry, index) {
      this.$store.commit('config/match/UPDATE_WHITELIST_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removeWhitelistEntry(entry) {
      this.$store.commit('config/match/REMOVE_WHITELIST_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addWhitelistEntry() {
      this.$store.commit('config/match/ADD_WHITELIST_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    },

    updateSpikeOrThreshold(val) {
      if (val === 'spike') {
        this.type = 'spike';
      } else if (val === 'any') {
        this.type = 'any';
        this.popAboveVisible = false;
      } else if (this.aboveOrBelow === 'above') {
        this.type = 'frequency';
      } else {
        this.type = 'flatline';
      }

      this.$nextTick(() => {
        this.validate();
      });
    },

    updateTimeframe(val) {
      this.timeframe = val;
    },

    updateTermsWindowSize(val) {
      this.termsWindowSize = val;
    },

    updateWindowStepSize(val) {
      this.windowStepSize = val;
    },

    updateAboveOrBelow(val) {
      if (val === 'above') {
        this.type = 'frequency';
        this.threshold = null;
      } else {
        this.type = 'flatline';
        this.numEvents = null;
      }
    },

    selectWhen(val) {
      this.metricAggType = val;

      if (val === 'count') {
        if (this.aboveOrBelow === 'above') {
          this.type = 'frequency';
        } else {
          this.type = 'flatline';
        }
      } else if (val === 'field in list') {
        this.type = 'blacklist';
        this.compareKey = '';
      } else if (val === 'field not in list') {
        this.type = 'whitelist';
        this.compareKey = '';
      } else if (val === 'new term') {
        this.type = 'new_term';
      } else if (val === 'field changes') {
        this.type = 'change';
        this.compareKey = [];
      } else {
        this.type = 'metric_aggregation';
      }

      this.useTimeframe = true;

      this.threshold = null;
      this.numEvents = null;
      this.maxThreshold = null;
      this.minThreshold = null;

      this.popWhenVisible = false;

      this.$nextTick(() => {
        this.validate();
      });
    }
  }
};
</script>

<style lang="scss" >
.el-popover .el-form-item {
  margin-bottom: 10px !important;
}

.el-popover .el-form-item:last-child {
  margin-bottom: 0 !important;
}

.el-tabs__active-bar.is-bottom {
  top: 0;
}

.is-bottom .el-tabs__nav-wrap::after {
  top: 0;
}

.el-popover.popover-options {
  padding-top: 5px;
  max-width: 600px;
}

.popover-time {
  max-width: 320px;
}
</style>

<style scoped>
.el-menu {
  border: 0;
}

.el-dialog__wrapper {
  z-index: 9999;
}

.close-button {
  position: absolute;
  right: 20px;
  z-index: 9;
}
</style>
