import { defineStore } from 'pinia';

function initialState() {
  return {
    alert: [],
    realert: { minutes: 5 },
    aggregationSchedule: '',
    aggregationKey: '',
    summaryTableFields: [],
    subject: '',
    body: '',
    bodyType: 'alert_text_only',
    alertSubjectArgs: [],
    alertTextArgs: []
  };
}

export const useConfigAlertStore = defineStore('config-alert', {
  state: () => ({
    ...initialState()
  }),

  actions: {
    reset() {
      Object.assign(this, initialState());
    },

    updateAlert(alert) {
      this.alert = alert;
    },

    updateRealert(realert) {
      this.realert = realert;
    },

    updateAggregationSchedule(schedule) {
      this.aggregationSchedule = schedule;
    },

    updateSubject(subject) {
      this.subject = subject;
    },

    updateBody(body) {
      this.body = body;
    }
  }
});