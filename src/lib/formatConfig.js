import cloneDeep from 'lodash.clonedeep';
import { htmlToConfigFormat } from './alertText';

export function formatConfig(config) {
  let conf = cloneDeep(config);

  let formattedSubject = htmlToConfigFormat(conf.alert_subject);
  conf.alert_subject = formattedSubject.alertText;
  conf.alert_subject_args = formattedSubject.alertArgs;

  let formattedText = htmlToConfigFormat(conf.alert_text);
  conf.alert_text = formattedText.alertText;
  conf.alert_text_args = formattedText.alertArgs;

  if (typeof conf.__praeco_query_builder === 'object') {
    conf.__praeco_query_builder = JSON.stringify(conf.__praeco_query_builder);
  } else {
    console.warn('Tried to convert __praeco_query_builder to string but not an object!');
  }

  return conf;
}
