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

    <h1 v-show="!showRename">
      {{ rule.name }}
      <el-tag v-if="rule.is_enabled" type="success">
        <Bulb success />
        Enabled
      </el-tag>
      <el-tag v-else type="warning">Disabled</el-tag>
    </h1>

    <el-row>
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

      <router-link :to="{
        name: 'ruleconfigbuilder',
        params: { action: 'edit', path: id } }">
        <el-button icon="el-icon-edit" plain type="primary">Edit</el-button>
      </router-link>

      <el-button plain type="info" @click="showRenameInput">Rename</el-button>

      <el-button plain type="info" @click="duplicate">Duplicate</el-button>

      <el-button plain type="info" @click="showMoveDialog">Move</el-button>

      <el-button
        icon="el-icon-delete"
        plain
        type="danger"
        @click="showDeleteConfirm">
        Delete...
      </el-button>

      <el-dialog
        :visible.sync="moveVisible"
        title="Move"
        width="40%"
        @close="moveVisible = false">
        <div>
          <FolderTree v-model="moveDest" type="rules" />
        </div>
        <span slot="footer">
          <el-button @click="moveVisible = false">Cancel</el-button>
          <el-button type="primary" @click="move">Move rule</el-button>
        </span>
      </el-dialog>
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
              {{ titleCase(scope.row.alert_info && scope.row.alert_info.type) }}
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
import changeCase from 'change-case';
import { logger } from '@/lib/logger.js';
import networkError from '../lib/networkError.js';
import { formatConfig } from '../lib/formatConfig';

export default {
  props: ['id'],
  data() {
    return {
      moveVisible: false,
      moveDest: '',
      showRename: false,
      newName: '',
      queryLog: [],
      alertLog: [],
      silenceLog: []
    };
  },
  computed: {
    rule() {
      return this.$store.state.configs.rules[this.id] || {};
    },
    yaml() {
      if (!this.rule.name) return false;
      let conf = formatConfig(this.rule);
      return yaml.safeDump(conf);
    }
  },
  async mounted() {
    await this.$store.dispatch('configs/fetchConfig', { path: this.id, type: 'rules' });
    this.newName = this.rule.name;
    this.getQueryLog();
    this.getAlertLog();
    this.getSilenceLog();
  },
  methods: {
    //
    // Move
    //

    async move() {
      let newPath = await this.$store.dispatch('configs/moveConfig', {
        oldConfig: this.rule,
        newPath: this.moveDest.replace(/_rules/, ''),
        type: 'rules'
      });

      // This action returns the new path, so if it does (will return falsey if not)
      // then route to it.
      if (newPath) {
        this.$router.push(`/rules/${newPath}`, { query: { refreshTree: true } });
      } else {
        this.$message.warning('Could not move the rule. Perhaps a rule with the same name already exists at this location?');
      }
    },

    showMoveDialog() {
      this.moveDest = '';
      this.moveVisible = true;
    },

    //
    // Rename
    //

    async rename() {
      let res = await this.$store.dispatch('configs/renameConfig', {
        config: this.rule,
        newName: this.newName.trim(),
        type: 'rules'
      });

      // This action will return the new name back at us if it worked
      if (res) {
        this.$router.push(`/rules/${res}`, { query: { refreshTree: true } });
      } else {
        this.$message.warning('Could not rename the rule. Perhaps a rule already exists with that name?');
      }
    },

    showRenameInput() {
      this.showRename = true;
      Vue.nextTick(() => {
        this.$refs.rename.$el.querySelector('input').focus();
        this.$refs.rename.$el.querySelector('input').select();
      });
    },

    //
    // Duplicate
    //

    async duplicate() {
      let path = await this.$store.dispatch('configs/duplicateConfig', {
        config: this.rule,
        type: 'rules'
      });

      // This action returns the path of the new rule
      if (path) {
        this.$router.push(`/rules/${path}`, { query: { refreshTree: true } });
      } else {
        this.$message.warning('Could not duplicate the rule.');
      }
    },

    //
    // Delete
    //

    showDeleteConfirm() {
      this.$confirm('Are you sure you want to delete this rule?', 'Confirm', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(this.delete)
        .catch(() => {});
    },

    async delete() {
      let deleted = await this.$store.dispatch('configs/deleteConfig', {
        path: this.id,
        type: 'rules'
      });

      // This action will return true/false depending on if the delete worked
      if (deleted) {
        this.$message({
          type: 'success',
          message: 'Rule deleted'
        });
        this.$router.push('/rules', { query: { refreshTree: true } });
      } else {
        this.$message.warning('Could not delete the rule.');
      }
    },

    //
    // Disable
    //

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
          let disabled = await this.$store.dispatch('configs/disableRule', this.rule);
          if (disabled) {
            this.$message({
              type: 'success',
              message: 'Rule disabled'
            });
          }
        })
        .catch(() => {});
    },

    //
    // Enable
    //

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
          let enabled = await this.$store.dispatch('configs/enableRule', this.rule);
          if (enabled) {
            this.$message({
              type: 'success',
              message: 'Rule enabled'
            });
          }
        })
        .catch(() => {});
    },

    //
    // Query log
    //
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

    //
    // Alert log
    //
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

    //
    // Silence log
    //
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

    titleCase(val) {
      return changeCase.titleCase(val);
    },

    shortDate(rawDate) {
      let [date, time] = new Date(rawDate).toLocaleString('en-US').split(', ');
      return `${date} ${time}`;
    }
  }
};
</script>

<style scoped>
h1 .el-tag {
  position: relative;
  top: -3px;
}
</style>
