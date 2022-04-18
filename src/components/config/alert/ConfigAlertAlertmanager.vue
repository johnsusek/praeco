<template>
  <div>
    <!-- alertmanager_alert_subject_labelname -->

    <praeco-form-item label="alert_subject_labelname" prop="alertmanagerAlertSubjectLabelname">
      <el-input id="alertmanagerAlertSubjectLabelname" v-model="alertmanagerAlertSubjectLabelname" :disabled="viewOnly" />
      <label>
        Rename the annotations label name for alert_subject.
        Default is summary.
      </label>
    </praeco-form-item>

    <!-- alertmanager_alert_text_labelname -->

    <praeco-form-item label="alert_text_labelname" prop="alertmanagerAlertTextLabelname">
      <el-input id="alertmanagerAlertTextLabelname" v-model="alertmanagerAlertTextLabelname" :disabled="viewOnly" />
      <label>
        Rename the annotations label name for alert_text.
        Default is description.
      </label>
    </praeco-form-item>

    <!-- alertmanager_ca_certs -->

    <praeco-form-item label="CA Certs" prop="alertmanagerCaCerts">
      <el-switch
        id="alertmanagerCaCerts"
        v-model="alertmanagerCaCerts"
        :disabled="viewOnly"
        @change="changeAlertmanagerCaCerts" />
    </praeco-form-item>

    <!-- alertmanager_ignore_ssl_errors -->

    <praeco-form-item label="Ignore SSL Errors" prop="alertmanagerIgnoreSslErrors">
      <el-switch
        id="alertmanagerIgnoreSslErrors"
        v-model="alertmanagerIgnoreSslErrors"
        :disabled="viewOnly"
        @change="changeAlertmanagerIgnoreSslErrors" />
    </praeco-form-item>

    <!-- alertmanager_timeout -->

    <praeco-form-item label="Timeout" prop="alertmanagerTimeout">
      <el-input-number id="alertmanagerTimeout" v-model="alertmanagerTimeout" :disabled="viewOnly" />
      <label>
        You can specify a timeout value, in seconds, for making communicating with Alertmanager.
        The default is 10. If a timeout occurs, the alert will be retried next time ElastAlert 2 cycles.
      </label>
    </praeco-form-item>

    <!-- alertmanager_proxy -->

    <praeco-form-item label="Proxy" prop="alertmanagerProxy">
      <el-input id="alertmanagerProxy" v-model="alertmanagerProxy" :disabled="viewOnly" />
      <label>
        By default ElastAlert 2 will not use a network proxy to send notifications to Alertmanager.
        Set this option using hostname:port if you need to use a proxy.
      </label>
    </praeco-form-item>

    <!-- alertmanager_basic_auth_login -->

    <praeco-form-item label="Proxy Login" prop="alertmanagerBasicAuthLogin">
      <el-input id="alertmanagerBasicAuthLogin" v-model="alertmanagerBasicAuthLogin" :disabled="viewOnly" />
      <label>The Alertmanager proxy auth username.</label>
    </praeco-form-item>

    <!-- alertmanager_basic_auth_password -->

    <praeco-form-item label="Proxy Password" prop="alertmanagerBasicAuthPassword">
      <el-input id="alertmanagerBasicAuthPassword" v-model="alertmanagerBasicAuthPassword" :disabled="viewOnly" />
      <label>The Alertmanager proxy auth password.</label>
    </praeco-form-item>
  </div>
</template>

<script>
export default {
  components: {
  },

  props: ['viewOnly'],

  computed: {

    alertmanagerAlertSubjectLabelname: {
      get() {
        return this.$store.state.config.alert.alertmanagerAlertSubjectLabelname;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ALERTMANAGER_ALERT_SUBJECT_LABELNAME',
          value
        );
      }
    },

    alertmanagerAlertTextLabelname: {
      get() {
        return this.$store.state.config.alert.alertmanagerAlertTextLabelname;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ALERTMANAGER_ALERT_TEXT_LABELNAME',
          value
        );
      }
    },

    alertmanagerCaCerts: {
      get() {
        return this.$store.state.config.alert.alertmanagerCaCerts;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ALERTMANAGER_CA_CERTS',
          value
        );
      }
    },

    alertmanagerIgnoreSslErrors: {
      get() {
        return this.$store.state.config.alert.alertmanagerIgnoreSslErrors;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ALERTMANAGER_IGNORE_SSL_ERRORS',
          value
        );
      }
    },

    alertmanagerTimeout: {
      get() {
        return this.$store.state.config.alert.alertmanagerTimeout;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ALERTMANAGER_TIMEOUT',
          value
        );
      }
    },

    alertmanagerProxy: {
      get() {
        return this.$store.state.config.alert.alertmanagerProxy;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ALERTMANAGER_PROXY',
          value
        );
      }
    },

    alertmanagerBasicAuthLogin: {
      get() {
        return this.$store.state.config.alert.alertmanagerBasicAuthLogin;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ALERTMANAGER_BASIC_AUTH_LOGIN',
          value
        );
      }
    },

    alertmanagerBasicAuthPassword: {
      get() {
        return this.$store.state.config.alert.alertmanagerBasicAuthPassword;
      },
      set(value) {
        this.$store.commit(
          'config/alert/UPDATE_ALERTMANAGER_BASIC_AUTH_PASSWORD',
          value
        );
      }
    },
  },

  methods: {
    changeAlertmanagerIgnoreSslErrors(val) {
      if (val) {
        this.alertmanagerIgnoreSslErrors = true;
      } else {
        this.alertmanagerIgnoreSslErrors = false;
      }
    },

    changeAlertmanagerAttachKibanaDiscoverUrl(val) {
      if (val) {
        this.alertmanagerAttachKibanaDiscoverUrl = true;
      } else {
        this.alertmanagerAttachKibanaDiscoverUrl = false;
      }
    },

    changeAlertmanagerCaCerts(val) {
      if (val) {
        this.alertmanagerCaCerts = true;
      } else {
        this.alertmanagerCaCerts = false;
      }
    }
  }
};
</script>
