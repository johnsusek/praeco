<template>
  <div>
    <el-popover v-model="popCommandVisible" :class="{ 'is-invalid': !popCommandValid }">
      <template v-slot:reference>
        <span class="pop-trigger">
          <el-tooltip v-if="command.length" :content="command.join(', ')" placement="top">
            <span>Command ({{ command.length }})</span>
          </el-tooltip>
          <span v-else>Command ({{ command.length }})</span>
        </span>
      </template>
      <template>
        <el-form
          ref="command"
          :model="$store.state.config.alert"
          label-position="top"
          style="width: 360px"
          @submit.native.prevent>
          <el-form-item
            v-for="(entry, index) in command"
            :key="index"
            :prop="'command.' + index"
            :disabled="viewOnly"
            class="el-form-item-list"
            label=""
            required>
            <el-row :gutter="5" type="flex" justify="space-between">
              <el-col :span="20">
                <el-input
                  v-model="command[index]"
                  :disabled="viewOnly"
                  placeholder="Commands"
                  @input="(val) => updateCommand(val, index)" />
              </el-col>
              <el-col :span="4">
                <el-button
                  :disabled="viewOnly"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  plain
                  @click="removeCommandEntry(entry)" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>

        <el-button :disabled="viewOnly" class="m-n-sm" @click="addCommandEntry">
          Add Command
        </el-button>
      </template>
    </el-popover>

    <el-form-item label="Pipe Match Json" prop="pipeMatchJson">
      <el-switch
        id="pipeMatchJson"
        v-model="pipeMatchJson"
        :disabled="viewOnly"
        @change="changePipeMatchJson" />
      <label>
        If true, the match will be converted to JSON and passed to stdin of the command.
        Note that this will cause ElastAlert 2 to block until the command exits or sends an EOF to stdout.
      </label>
    </el-form-item>

    <el-form-item label="Pipe Alert Text" prop="pipeAlertText">
      <el-switch
        id="pipeAlertText"
        v-model="pipeAlertText"
        :disabled="viewOnly"
        @change="changePipeAlertText" />
      <label>
        If true, the standard alert body text will be passed to stdin of the command.
        Note that this will cause ElastAlert 2 to block until the command exits or sends an EOF to stdout.
        It cannot be used at the same time as pipe_match_json.
      </label>
    </el-form-item>

    <el-form-item label="fail_on_non_zero_exit" prop="failOnNonZeroExit">
      <el-switch
        id="failOnNonZeroExit"
        v-model="failOnNonZeroExit"
        :disabled="viewOnly"
        @change="changeFailOnNonZeroExit" />
      <label>
        By default this is False. Allows monitoring of when commands fail to run.
        When a command returns a non-zero exit status, the alert raises an exception.
      </label>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: ['viewOnly'],

  data() {
    return {
      popCommandVisible: false,
      popCommandValid: true,
    };
  },

  computed: {
    command: {
      get() {
        return this.$store.state.config.alert.command;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_COMMAND',
          value
        );
      }
    },

    pipeMatchJson: {
      get() {
        return this.$store.state.config.alert.pipeMatchJson;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PIPE_MATCH_JSON',
          value
        );
      }
    },

    pipeAlertText: {
      get() {
        return this.$store.state.config.alert.pipeAlertText;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_PIPE_ALERT_TEXT',
          value
        );
      }
    },

    failOnNonZeroExit: {
      get() {
        return this.$store.state.config.alert.failOnNonZeroExit;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_FAIL_ON_NON_ZERO_EXIT',
          value
        );
      }
    }
  },

  methods: {
    changePipeMatchJson(val) {
      if (val) {
        this.pipeMatchJson = true;
      } else {
        this.pipeMatchJson = false;
      }
    },

    changePipeAlertText(val) {
      if (val) {
        this.pipeAlertText = true;
      } else {
        this.pipeAlertText = false;
      }
    },

    changeFailOnNonZeroExit(val) {
      if (val) {
        this.failOnNonZeroExit = true;
      } else {
        this.failOnNonZeroExit = false;
      }
    },

    async validate() {
      try {
        if (this.$refs.command) {
          await this.validateCommand();
        }
        this.$emit('validate', true);
        return true;
      } catch (error) {
        this.$emit('validate', false);
        return false;
      }
    },

    async validateCommand() {
      if (!this.command.length) {
        this.popCommandValid = false;
        return;
      }
      try {
        this.popCommandValid = await this.$refs.command.validate();
      } catch (error) {
        this.popCommandValid = false;
        throw error;
      }
    },

    updateCommand(entry, index) {
      if (Number.isNaN(entry)) return;
      this.$store.commit('config/alert/UPDATE_COMMAND_ENTRY', {
        entry,
        index
      });
      this.$nextTick(() => {
        this.validate();
      });
    },

    removeCommandEntry(entry) {
      this.$store.commit('config/alert/REMOVE_COMMAND_ENTRY', entry);
      this.$nextTick(() => {
        this.validate();
      });
    },

    addCommandEntry() {
      this.$store.commit('config/alert/ADD_COMMAND_ENTRY');
      this.$nextTick(() => {
        this.validate();
      });
    }
  }
};
</script>

<style lang="scss">

</style>
