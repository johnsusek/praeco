import Vue from 'vue';
import { expect } from 'chai';
import store from '@/store';
import ConfigAlert from '@/components/config/alert/ConfigAlert';
import { mountComponent, mockAxios } from '../setup';
import mockChartData from '../mockData/chartData.json';
import { ruleYaml } from '../mockData/ruleData.js';

mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });
mockAxios.onPost('/api/search/hannibal-*').reply(200, mockChartData);

async function prep() {
  await store.dispatch('config/load', { type: 'rules', path: 'test123' });
  let wrapper = mountComponent(ConfigAlert);
  await Vue.nextTick();
  return wrapper;
}

let wrapper;

describe('ConfigAlert', () => {
  it('renders the realert amount', async () => {
    wrapper = await prep();
    let value = wrapper.find('#realert input[min="0"]').element.value;
    return expect(value).to.equal('5');
  });

  it('renders the realert unit', () => {
    return expect(wrapper.find('#realert .el-select input').element.value).to.equal('Minutes');
  });

  it('renders the right destination', () => {
    let correct = (wrapper.find('#destinationSlack input').element.checked
                  && !wrapper.find('#destinationEmail input').element.checked
                  && !wrapper.find('#destinationPost input').element.checked);
    return expect(correct).to.equal(true);
  });

  it('renders the right subject', () => {
    return expect(wrapper.find('#subject div[contenteditable]').element.textContent).to.equal('this is a test subject');
  });

  it('renders the right body', () => {
    return expect(wrapper.find('#body div[contenteditable]').element.textContent).to.equal('this is a test body');
  });

  it('renders the right slack channel', async () => {
    wrapper.setData({
      visibleTabPane: '1'
    });
    return expect(wrapper.find('#slackChannelOverride').element.value).to.equal('#elastalert-debugging');
  });

  it('renders the right slack user', () => {
    return expect(wrapper.find('#slackUsernameOverride').element.value).to.equal('Praeco');
  });

  it('renders the right slack message color', () => {
    return expect(wrapper.find('#slackMsgColorDanger input').element.checked).to.equal(true);
  });
});
