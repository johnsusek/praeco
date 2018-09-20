import { htmlToConfigFormat } from './alertText';

export function formatConfig(config) {
  let formattedSubject = htmlToConfigFormat(config.alert_subject);
  config.alert_subject = formattedSubject.alertText;
  config.alert_subject_args = formattedSubject.alertArgs;

  let formattedText = htmlToConfigFormat(config.alert_text);
  config.alert_text = formattedText.alertText;
  config.alert_text_args = formattedText.alertArgs;

  config.__praeco_query_builder = JSON.stringify(config.__praeco_query_builder);

  return config;
}
