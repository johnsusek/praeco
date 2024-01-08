<template>
  <div>
    <praeco-form-item label="Host" prop="irisHost" required>
      <el-input id="irisHost" :value="irisHost" :disabled="viewOnly" @input="irisHost = $event" />
      <label>
        Address of the Iris host. Exclude https:// For example: iris.example.com.
      </label>
    </praeco-form-item>

    <praeco-form-item label="irisApiToken" prop="irisApiToken" required>
      <el-input id="irisApiToken" :value="irisApiToken" :disabled="viewOnly" @input="irisApiToken = $event" />
      <label>
        The API key of the user you created, which will be used to initiate alerts and cases on behalf of this user.
      </label>
    </praeco-form-item>

    <!-- TODO: Error saving config, are all fields filled out? -->
    <!--
    <praeco-form-item label="CA Cert" prop="irisCaCert">
      <el-switch
        id="irisCaCert"
        :value="irisCaCert"
        :disabled="viewOnly"
        @change="changeIrisCaCert" />
    </praeco-form-item>
    -->

    <praeco-form-item label="Customer Id" prop="irisCustomerId">
      <el-input-number id="irisCustomerId" :value="irisCustomerId" :disabled="viewOnly" @input="irisCustomerId = $event" />
      <label>
        This field represents the unique identifier of the customer for whom an incident/case will be created within the system.
        Configure and view the existing options in the section Advanced -> Customers of your IRIS instance.
        The default value is: 1.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Ignore SSL Errors" prop="irisIgnoreSslErrors">
      <el-switch
        id="irisIgnoreSslErrors"
        :value="irisIgnoreSslErrors"
        :disabled="viewOnly"
        @change="changeIrisIgnoreSslErrors" />
    </praeco-form-item>

    <praeco-form-item label="Description" prop="irisDescription">
      <el-input id="irisDescription" :value="irisDescription" :disabled="viewOnly" @input="irisDescription = $event" />
      <label>
        Description of the alert or case.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Overwrite Timestamp" prop="irisOverwriteTimestamp">
      <el-switch
        id="irisOverwriteTimestamp"
        :value="irisOverwriteTimestamp"
        :disabled="viewOnly"
        @change="changeIrisOverwriteTimestamp" />
    </praeco-form-item>

    <praeco-form-item label="Type" prop="irisType">
      <el-radio-group :value="irisType" :disabled="viewOnly" @input="irisType = $event">
        <el-radio id="irisTypeAlert" label="alert" border>
          alert
        </el-radio>
        <el-radio id="irisTypeCase" label="case" border>
          case
        </el-radio>
      </el-radio-group>
      <label>The type of object being created. It can be either alert or case. The default value is alert.</label>
    </praeco-form-item>

    <praeco-form-item label="Case template ID" prop="irisCaseTemplateId">
      <el-input-number id="irisCaseTemplateId" :value="irisCaseTemplateId" :disabled="viewOnly" @input="irisCaseTemplateId = $event" />
      <label>
        Case template ID, if you want to apply a pre-prepared template.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Alert Note" prop="irisAlertNote">
      <el-input id="irisAlertNote" :value="irisAlertNote" :disabled="viewOnly" @input="irisAlertNote = $event" />
      <label>
        Note for the alert.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Alert Tags" prop="irisAlertTags">
      <el-input id="irisAlertTags" :value="irisAlertTags" :disabled="viewOnly" @input="irisAlertTags = $event" />
      <label>
        List of tags.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Alert Status Id" prop="irisAlertStatusId">
      <el-input-number id="irisAlertStatusId" :value="irisAlertStatusId" :disabled="viewOnly" :min="1" :max="7" @input="irisAlertStatusId = $event" />
      <label>
        The alert status of the alert, default value is 2. This parameter requires an integer input.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Alert Source Link" prop="irisAlertSourceLink">
      <el-input id="irisAlertSourceLink" :value="irisAlertSourceLink" :disabled="viewOnly" @input="irisAlertSourceLink = $event" />
      <label>
        Your custom link, if needed.
      </label>
    </praeco-form-item>

    <praeco-form-item label="Alert Severity Id" prop="irisAlertSeverityId">
      <el-input-number id="irisAlertSeverityId" :value="irisAlertSeverityId" :disabled="viewOnly" :min="1" :max="6" @input="irisAlertSeverityId = $event" />
      <label>
        The severity level of the alert, default value is 1. This parameter requires an integer input.
      </label>
    </praeco-form-item>
  </div>
</template>

<script>
export default {
  props: ['viewOnly'],
  computed: {
    irisHost: {
      get() {
        return this.$store.state.config.alert.irisHost;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_IRIS_HOST', value);
      }
    },
    irisApiToken: {
      get() {
        return this.$store.state.config.alert.irisApiToken;
      },
      set(value) {
        this.$store.commit('config/alert/UPDATE_IRIS_API_TOKEN', value);
      }
    },
    irisCustomerId: {
      get() {
        return this.$store.state.config.alert.irisCustomerId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_IRIS_CUSTOMER_ID',
          value
        );
      }
    },
    irisIgnoreSslErrors: {
      get() {
        return this.$store.state.config.alert.irisIgnoreSslErrors;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_IRIS_IGNORE_SSL_ERRORS',
          value
        );
      }
    },
    /*
    TODO: Error saving config, are all fields filled out?
    irisCaCert: {
      get() {
        return this.$store.state.config.alert.irisCaCert;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_IRIS_CA_CERT',
          value
        );
      }
    },
    */
    irisDescription: {
      get() {
        return this.$store.state.config.alert.irisDescription;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_IRIS_DESCRIPTION',
          value
        );
      }
    },
    irisOverwriteTimestamp: {
      get() {
        return this.$store.state.config.alert.irisOverwriteTimestamp;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_IRIS_OVERWRITE_TIMESTAMP',
          value
        );
      }
    },
    irisType: {
      get() {
        return this.$store.state.config.alert.irisType;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_IRIS_TYPE',
          value
        );
      }
    },
    irisCaseTemplateId: {
      get() {
        return this.$store.state.config.alert.irisCaseTemplateId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_IRIS_CASE_TEMPLATE_ID',
          value
        );
      }
    },
    irisAlertNote: {
      get() {
        return this.$store.state.config.alert.irisAlertNote;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_IRIS_ALERT_NOTE',
          value
        );
      }
    },
    irisAlertTags: {
      get() {
        return this.$store.state.config.alert.irisAlertTags;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_IRIS_ALERT_TAGS',
          value
        );
      }
    },
    irisAlertStatusId: {
      get() {
        return this.$store.state.config.alert.irisAlertStatusId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_IRIS_ALERT_STATUS_ID',
          value
        );
      }
    },
    irisAlertSourceLink: {
      get() {
        return this.$store.state.config.alert.irisAlertSourceLink;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_IRIS_ALERT_SOURCE_LINK',
          value
        );
      }
    },
    irisAlertSeverityId: {
      get() {
        return this.$store.state.config.alert.irisAlertSeverityId;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_IRIS_ALERT_SEVERITY_ID',
          value
        );
      }
    }
  },

  methods: {
    changeIrisIgnoreSslErrors(val) {
      this.irisIgnoreSslErrors = val;
    },
    /*
    TODO: Error saving config, are all fields filled out?
    changeIrisCaCert(val) {
      this.irisCaCert = val;
    },
    */
    changeIrisOverwriteTimestamp(val) {
      this.irisOverwriteTimestamp = val;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
