import { expect } from 'chai';
import Silences from '@/views/Silences';
import mockSilenceLog from '../mockData/silenceLog.json';
import { mountComponent, mockAxios } from '../setup';

mockAxios.onGet('/api/metadata/silence').reply(200, mockSilenceLog);

describe('Silences log', () => {
  let wrapper = mountComponent(Silences);

  it('renders the rule', () => {
    let tableRow = wrapper.find('.el-table__body-wrapper > table > tbody > tr:nth-child(2)');
    return expect(tableRow.find('.el-table_1_column_1').text()).to.equal('avgexample');
  });

  it('renders the until', () => {
    let tableRow = wrapper.find('.el-table__body-wrapper > table > tbody > tr:nth-child(2)');
    return expect(tableRow.find('.el-table_1_column_2').text()).to.not.be.empty;
  });

  it('renders the timestamp', () => {
    let tableRow = wrapper.find('.el-table__body-wrapper > table > tbody > tr:nth-child(2)');
    return expect(tableRow.find('.el-table_1_column_3').text()).to.not.be.empty;
  });

  it('renders the exponent', () => {
    let tableRow = wrapper.find('.el-table__body-wrapper > table > tbody > tr:nth-child(2)');
    return expect(tableRow.find('.el-table_1_column_4').text()).to.equal('0');
  });
});
