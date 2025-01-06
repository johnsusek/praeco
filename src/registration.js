import { createApp } from 'vue';
import Bulb from '@/components/Bulb';
import DateTime from '@/components/DateTime';
import DefinitionTable from '@/components/DefinitionTable';
import ElastalertTimePicker from '@/components/ElastalertTimePicker';
import ESChart from '@/components/ESChart';
import EventTable from '@/components/EventTable';
import ExpandableAlert from '@/components/ExpandableAlert';
import FolderTree from '@/components/FolderTree';
import NavTree from '@/components/NavTree';
import PraecoFormItem from '@/components/PraecoFormItem';
import TableRow from '@/components/TableRow';
import ElastalertTimeView from '@/components/ElastalertTimeView';
import ConfigQuery from '@/components/config/ConfigQuery.vue';
import ConfigAggregation from '@/components/config/ConfigAggregation.vue';
import ConfigAlert from '@/components/config/alert/ConfigAlert.vue';
import ConfigAlertAlerta from '@/components/config/alert/ConfigAlertAlerta.vue';
import ConfigAlertAlertmanager from '@/components/config/alert/ConfigAlertAlertmanager.vue';
import ConfigAlertAmazonSes from '@/components/config/alert/ConfigAlertAmazonSes.vue';
import ConfigAlertAmazonSns from '@/components/config/alert/ConfigAlertAmazonSns.vue';
import ConfigAlertChatwork from '@/components/config/alert/ConfigAlertChatwork.vue';
import ConfigAlertCommand from '@/components/config/alert/ConfigAlertCommand.vue';
import ConfigAlertDatadog from '@/components/config/alert/ConfigAlertDatadog.vue';
import ConfigAlertDingtalk from '@/components/config/alert/ConfigAlertDingtalk.vue';
import ConfigAlertDiscord from '@/components/config/alert/ConfigAlertDiscord.vue';
import ConfigAlertEmail from '@/components/config/alert/ConfigAlertEmail.vue';
import ConfigAlertExotel from '@/components/config/alert/ConfigAlertExotel.vue';
import ConfigAlertGelf from '@/components/config/alert/ConfigAlertGelf.vue';
import ConfigAlertGitter from '@/components/config/alert/ConfigAlertGitter.vue';
import ConfigAlertGoogleChat from '@/components/config/alert/ConfigAlertGoogleChat.vue';
import ConfigAlertHttpPost from '@/components/config/alert/ConfigAlertHttpPost.vue';
import ConfigAlertHttpPost2 from '@/components/config/alert/ConfigAlertHttpPost2.vue';
import ConfigAlertIris from '@/components/config/alert/ConfigAlertIris.vue';
import ConfigAlertJira from '@/components/config/alert/ConfigAlertJira.vue';
import ConfigAlertLark from '@/components/config/alert/ConfigAlertLark.vue';
import ConfigAlertMattermost from '@/components/config/alert/ConfigAlertMattermost.vue';
import ConfigAlertMatrixHookshot from '@/components/config/alert/ConfigAlertMatrixHookshot.vue';
import ConfigAlertMsPowerAutomate from '@/components/config/alert/ConfigAlertMsPowerAutomate.vue';
import ConfigAlertPagerDuty from '@/components/config/alert/ConfigAlertPagerDuty.vue';
import ConfigAlertPagerTree from '@/components/config/alert/ConfigAlertPagerTree.vue';
import ConfigAlertRocketChat from '@/components/config/alert/ConfigAlertRocketChat.vue';
import ConfigAlertServiceNow from '@/components/config/alert/ConfigAlertServiceNow.vue';
import ConfigAlertSlack from '@/components/config/alert/ConfigAlertSlack.vue';
import ConfigAlertStomp from '@/components/config/alert/ConfigAlertStomp.vue';
import ConfigAlertTencentSms from '@/components/config/alert/ConfigAlertTencentSms.vue';
import ConfigAlertTelegram from '@/components/config/alert/ConfigAlertTelegram.vue';
import ConfigAlertTheHive from '@/components/config/alert/ConfigAlertTheHive.vue';
import ConfigAlertTwilio from '@/components/config/alert/ConfigAlertTwilio.vue';
import ConfigAlertOpsgenie from '@/components/config/alert/ConfigAlertOpsgenie.vue';
import ConfigAlertVictorOps from '@/components/config/alert/ConfigAlertVictorOps.vue';
import ConfigAlertZabbix from '@/components/config/alert/ConfigAlertZabbix.vue';
import ConfigAlertWorkWeChat from './components/config/alert/ConfigAlertWorkWeChat.vue';
import ConfigKibanaDiscover from '@/components/config/ConfigKibanaDiscover.vue';
import ConfigTimeWindowFeature from '@/components/config/ConfigTimeWindowFeature.vue';
import ConfigOwner from '@/components/config/ConfigOwner.vue';
import ConfigPriority from '@/components/config/ConfigPriority.vue';
import ConfigDescription from '@/components/config/ConfigDescription.vue';
import ConfigSettings from '@/components/config/ConfigSettings.vue';
import ConfigCondition from '@/components/config/ConfigCondition.vue';
import ConfigScanEntireTimeframe from '@/components/config/ConfigScanEntireTimeframe.vue';
import ConfigLimitExcecution from '@/components/config/ConfigLimitExcecution.vue';

const app = createApp();

app.component('Bulb', Bulb);
app.component('DateTime', DateTime);
app.component('ConfigQuery', ConfigQuery);
app.component('ConfigAlert', ConfigAlert);
app.component('ConfigAlertAlerta', ConfigAlertAlerta);
app.component('ConfigAlertAlertmanager', ConfigAlertAlertmanager);
app.component('ConfigAlertAmazonSes', ConfigAlertAmazonSes);
app.component('ConfigAlertAmazonSns', ConfigAlertAmazonSns);
app.component('ConfigAlertChatwork', ConfigAlertChatwork);
app.component('ConfigAlertCommand', ConfigAlertCommand);
app.component('ConfigAlertDatadog', ConfigAlertDatadog);
app.component('ConfigAlertDingtalk', ConfigAlertDingtalk);
app.component('ConfigAlertDiscord', ConfigAlertDiscord);
app.component('ConfigAlertEmail', ConfigAlertEmail);
app.component('ConfigAlertExotel', ConfigAlertExotel);
app.component('ConfigAlertGelf', ConfigAlertGelf);
app.component('ConfigAlertGitter', ConfigAlertGitter);
app.component('ConfigAlertGoogleChat', ConfigAlertGoogleChat);
app.component('ConfigAlertHttpPost', ConfigAlertHttpPost);
app.component('ConfigAlertHttpPost2', ConfigAlertHttpPost2);
app.component('ConfigAlertIris', ConfigAlertIris);
app.component('ConfigAlertJira', ConfigAlertJira);
app.component('ConfigAlertLark', ConfigAlertLark);
app.component('ConfigAlertMattermost', ConfigAlertMattermost);
app.component('ConfigAlertMatrixHookshot', ConfigAlertMatrixHookshot);
app.component('ConfigAlertMsPowerAutomate', ConfigAlertMsPowerAutomate);
app.component('ConfigAlertPagerDuty', ConfigAlertPagerDuty);
app.component('ConfigAlertPagerTree', ConfigAlertPagerTree);
app.component('ConfigAlertRocketChat', ConfigAlertRocketChat);
app.component('ConfigAlertServiceNow', ConfigAlertServiceNow);
app.component('ConfigAlertSlack', ConfigAlertSlack);
app.component('ConfigAlertStomp', ConfigAlertStomp);
app.component('ConfigAlertTencentSms', ConfigAlertTencentSms);
app.component('ConfigAlertTelegram', ConfigAlertTelegram);
app.component('ConfigAlertTheHive', ConfigAlertTheHive);
app.component('ConfigAlertTwilio', ConfigAlertTwilio);
app.component('ConfigAlertOpsgenie', ConfigAlertOpsgenie);
app.component('ConfigAlertVictorOps', ConfigAlertVictorOps);
app.component('ConfigAlertZabbix', ConfigAlertZabbix);
app.component('ConfigAlertWorkWeChat', ConfigAlertWorkWeChat);
app.component('ConfigAggregation', ConfigAggregation);
app.component('ConfigSettings', ConfigSettings);
app.component('ConfigKibanaDiscover', ConfigKibanaDiscover);
app.component('ConfigTimeWindowFeature', ConfigTimeWindowFeature);
app.component('ConfigOwner', ConfigOwner);
app.component('ConfigPriority', ConfigPriority);
app.component('ConfigDescription', ConfigDescription);
app.component('ConfigCondition', ConfigCondition);
app.component('ConfigScanEntireTimeframe', ConfigScanEntireTimeframe);
app.component('ConfigLimitExcecution', ConfigLimitExcecution);
app.component('DefinitionTable', DefinitionTable);
app.component('ElastalertTimePicker', ElastalertTimePicker);
app.component('ESChart', ESChart);
app.component('EventTable', EventTable);
app.component('ExpandableAlert', ExpandableAlert);
app.component('FolderTree', FolderTree);
app.component('NavTree', NavTree);
app.component('PraecoFormItem', PraecoFormItem);
app.component('TableRow', TableRow);
app.component('ElastalertTimeView', ElastalertTimeView);
