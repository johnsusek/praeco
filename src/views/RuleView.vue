<template>
  <div>
    <div v-show="showRename" >
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input
            ref="rename"
            v-model="newName"
            size="large"
            autofocus
            autoselect
            @keyup.enter.native="rename" />
        </el-col>
        <el-col :span="18">
          <el-button size="large" type="primary" @click="rename">Save</el-button>
          <el-button size="large" @click="showRename = false">Cancel</el-button>
        </el-col>
      </el-row>
      <br>
    </div>

    <h1 v-show="!showRename">{{ rule.name }}</h1>

    <el-row class="tag-row">
      <el-tag v-if="rule.is_enabled" type="success">Enabled</el-tag>
      <el-tag v-else type="warning">Disabled</el-tag>
    </el-row>

    <el-row>
      <router-link :to="{
        name: 'ruleconfigbuilder',
        params: { action: 'edit', template: id } }">
        <el-button icon="el-icon-edit" plain type="info">Edit</el-button>
      </router-link>

      <el-button plain type="info" @click="showRenameInput">Rename</el-button>

      <el-button plain type="info" @click="duplicate">Duplicate</el-button>

      <el-button
        v-if="rule.is_enabled"
        plain
        type="warning"
        @click="handleDisable">
        Disable...
      </el-button>

      <el-button
        v-if="!rule.is_enabled"
        plain
        type="success"
        @click="handleEnable">
        Enable...
      </el-button>

      <el-button
        icon="el-icon-delete"
        plain
        type="danger"
        @click="handleDelete">
        Delete...
      </el-button>
    </el-row>

    <br>


    <el-tabs type="card" >
      <el-tab-pane label="Overview">
        <ConfigView :config="rule" />
        <br>
      </el-tab-pane>

      <el-tab-pane label="Alert log">
        <el-table :data="alertLog" empty-text="">
          <el-table-column label="Alert sent" width="100">
            <span slot-scope="scope">
              <el-tag v-if="scope.row.alert_sent" type="success">Sent</el-tag>
              <el-tag v-else type="danger">Not sent</el-tag>
            </span>
          </el-table-column>
          <el-table-column label="Match time" width="170">
            <span slot-scope="scope">
              {{ shortDate(scope.row.match_time) }}
            </span>
          </el-table-column>
          <el-table-column label="Alert time" width="170">
            <span slot-scope="scope">
              {{ shortDate(scope.row.alert_time) }}
            </span>
          </el-table-column>
          <el-table-column label="Alert type" width="100">
            <span slot-scope="scope">
              {{ uppercase(scope.row.alert_info && scope.row.alert_info.type) }}
            </span>
          </el-table-column>
          <el-table-column label="Exception" prop="alert_exception" />
          <el-table-column label="Aggregate ID" prop="aggregate_id" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="Query log">
        <el-table :data="queryLog" empty-text="">
          <el-table-column label="Start time" width="170">
            <span slot-scope="scope">
              {{ shortDate(scope.row.starttime) }}
            </span>
          </el-table-column>
          <el-table-column label="End time" width="170">
            <span slot-scope="scope">
              {{ shortDate(scope.row.endtime) }}
            </span>
          </el-table-column>
          <el-table-column label="Hits" prop="hits" width="100" />
          <el-table-column label="Matches" prop="matches" width="100" />
          <el-table-column label="Time taken" prop="time_taken" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="Silence log">
        <el-alert
          show-icon
          title="Matches are silenced when you've already
          been alerted within the rule's re-alert timeframe." />
        <el-table :data="silenceLog" empty-text="">
          <el-table-column label="Until" width="170">
            <span slot-scope="scope">
              {{ shortDate(scope.row.until) }}
            </span>
          </el-table-column>
          <el-table-column label="Timestamp" width="170">
            <span slot-scope="scope">
              {{ shortDate(scope.row['@timestamp']) }}
            </span>
          </el-table-column>
          <el-table-column label="Exponent" prop="exponent" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane v-if="yaml" label="YAML">
        <prism language="javascript">{{ yaml }}</prism>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import yaml from 'js-yaml';
import Prism from 'vue-prism-component';
import { logger } from '@/lib/logger.js';
import networkError from '../lib/networkError.js';
import { formatConfig } from '../lib/formatConfig';

export default {
  components: {
    Prism
  },
  props: ['id'],
  data() {
    return {
      showRename: false,
      newName: '',
      queryLog: [],
      alertLog: [],
      silenceLog: []
    };
  },
  computed: {
    rule() {
      return this.$store.state.rules.rules[this.id] || {};
    },
    yaml() {
      if (!this.rule.name) return false;
      let conf = formatConfig(this.rule);
      return yaml.safeDump(conf);
    }
  },
  async mounted() {
    await this.$store.dispatch('rules/fetchRule', this.id);
    this.newName = this.rule.name;
    this.getQueryLog();
    this.getAlertLog();
    this.getSilenceLog();
  },
  methods: {
    showRenameInput() {
      this.showRename = true;
      Vue.nextTick(() => {
        this.$refs.rename.$el.querySelector('input').focus();
        this.$refs.rename.$el.querySelector('input').select();
      });
    },
    async rename() {
      let res = await this.$store.dispatch('rules/renameRule', {
        oldName: this.rule.name,
        newName: this.newName.trim()
      });
      if (res) {
        this.$router.replace(`/rules/${res}`);
      }
    },
    async duplicate() {
      let res = await this.$store.dispatch('rules/duplicateRule', {
        name: this.rule.name
      });
      if (res) {
        this.$router.replace(`/rules/${res}`);
      }
    },
    uppercase(str) {
      return str[0].toUpperCase() + str.slice(1);
    },
    shortDate(rawDate) {
      let [date, time] = new Date(rawDate).toLocaleString('en-US').split(', ');
      return `${date} ${time}`;
    },
    async getQueryLog() {
      try {
        let res = await axios.get('/metadata/elastalert_status', {
          params: { rule_name: this.id }
        });
        if (res.data.error) {
          this.$notify.error({
            message: res.data.error.msg,
            title: 'Elasticsearch error',
            duration: 0
          });
          logger().error({ error: res.data.error });
        } else {
          this.queryLog = res.data.hits;
        }
      } catch (error) {
        networkError(error);
      }
    },
    async getAlertLog() {
      try {
        let res = await axios.get('/metadata/elastalert', {
          params: { rule_name: this.id }
        });
        if (res.data.error) {
          this.$notify.error({
            message: res.data.error.msg,
            title: 'Elasticsearch error',
            duration: 0
          });
          logger().error({ error: res.data.error });
        } else {
          this.alertLog = res.data.hits;
        }
      } catch (error) {
        networkError(error);
      }
    },
    async getSilenceLog() {
      try {
        let res = await axios.get('/metadata/silence', {
          params: { rule_name: this.id }
        });
        if (res.data.error) {
          this.$notify.error({
            message: res.data.error.msg,
            title: 'Elasticsearch error',
            duration: 0
          });
          logger().error({ error: res.data.error });
        } else {
          this.silenceLog = res.data.hits;
        }
      } catch (error) {
        networkError(error);
      }
    },
    handleDelete() {
      this.$confirm('Are you sure you want to delete this rule?', 'Confirm', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async () => {
          let deleted = await this.$store.dispatch('rules/deleteRule', this.id);
          if (deleted) {
            this.$message({
              type: 'success',
              message: 'Rule deleted'
            });
            this.$router.push({ name: 'rules' });
          }
        })
        .catch(() => {});
    },
    handleDisable() {
      this.$confirm(
        'Are you sure you want to disable this rule? This may take a few minutes to take effect, depending on elastalert settings.',
        'Confirm',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(async () => {
          let disabled = await this.$store.dispatch('rules/disableRule', this.rule);
          if (disabled) {
            this.$message({
              type: 'success',
              message: 'Rule disabled'
            });
          }
        })
        .catch(() => {});
    },
    handleEnable() {
      this.$confirm(
        'Are you sure you want to enable this rule? This may take a few minutes to take effect, depending on elastalert settings.',
        'Confirm',
        {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(async () => {
          let enabled = await this.$store.dispatch('rules/enableRule', this.rule);
          if (enabled) {
            this.$message({
              type: 'success',
              message: 'Rule enabled'
            });
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.tag-row {
  margin-bottom: 10px;
}

.tag-row .el-tag {
  margin-right: 5px;
}
</style>
