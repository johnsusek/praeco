import { expect } from 'chai';
import Alerts from '@/views/Alerts';
import mockAlertLog from '../mockData/alertLog.json';
import { mountComponent, mockAxios } from '../setup';

mockAxios.onGet('/api/metadata/elastalert').reply(200, mockAlertLog);

describe('Alerts log', () => {
  let wrapper = mountComponent(Alerts);

  it('renders the rule', () => {
    let tableRow = wrapper.find('.el-table__body-wrapper > table > tbody > tr:nth-child(8)');
    return expect(tableRow.find('.el-table_1_column_1').text()).to.equal('test1');
  });

  it('renders the alert sent', () => {
    let tableRow = wrapper.find('.el-table__body-wrapper > table > tbody > tr:nth-child(8)');
    return expect(tableRow.find('.el-table_1_column_2').text()).to.equal('Sent');
  });

  it('renders the match time', () => {
    let tableRow = wrapper.find('.el-table__body-wrapper > table > tbody > tr:nth-child(8)');
    return expect(tableRow.find('.el-table_1_column_3').text()).to.not.be.empty;
  });

  it('renders the alert time', () => {
    let tableRow = wrapper.find('.el-table__body-wrapper > table > tbody > tr:nth-child(8)');
    return expect(tableRow.find('.el-table_1_column_4').text()).to.not.be.empty;
  });

  it('renders the alert type', () => {
    let tableRow = wrapper.find('.el-table__body-wrapper > table > tbody > tr:nth-child(8)');
    return expect(tableRow.find('.el-table_1_column_5').text()).to.equal('Slack');
  });

  it('renders the table aggregate ID', () => {
    let tableRow = wrapper.find('.el-table__body-wrapper > table > tbody > tr:nth-child(8)');
    return expect(tableRow.find('.el-table_1_column_7').text()).to.equal('AWj0GpojUXvdr6LFrRJG');
  });
});
