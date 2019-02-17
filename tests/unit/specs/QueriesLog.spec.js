import { expect } from 'chai';
import Queries from '@/views/Queries';
import mockQueryLog from '../mockData/queryLog.json';
import { mountComponent, mockAxios } from '../setup';

mockAxios.onGet('/api/metadata/elastalert_status').reply(200, mockQueryLog);

describe('Queries log', () => {
  let wrapper = mountComponent(Queries);

  it('renders the rule', () => {
    let tableRow = wrapper.find('.el-table__body-wrapper > table > tbody > tr:nth-child(1)');
    return expect(tableRow.find('.el-table_1_column_1').text()).to.equal('test1');
  });

  it('renders the start time', () => {
    let tableRow = wrapper.find('.el-table__body-wrapper > table > tbody > tr:nth-child(1)');
    return expect(tableRow.find('.el-table_1_column_2').text()).to.not.be.empty;
  });

  it('renders the end time', () => {
    let tableRow = wrapper.find('.el-table__body-wrapper > table > tbody > tr:nth-child(1)');
    return expect(tableRow.find('.el-table_1_column_3').text()).to.not.be.empty;
  });

  it('renders the hits', () => {
    let tableRow = wrapper.find('.el-table__body-wrapper > table > tbody > tr:nth-child(1)');
    return expect(tableRow.find('.el-table_1_column_4').text()).to.equal('0');
  });

  it('renders the matches', () => {
    let tableRow = wrapper.find('.el-table__body-wrapper > table > tbody > tr:nth-child(1)');
    return expect(tableRow.find('.el-table_1_column_5').text()).to.equal('0');
  });

  it('renders the time taken', () => {
    let tableRow = wrapper.find('.el-table__body-wrapper > table > tbody > tr:nth-child(1)');
    return expect(tableRow.find('.el-table_1_column_6').text()).to.equal('0.1819450855255127');
  });
});
