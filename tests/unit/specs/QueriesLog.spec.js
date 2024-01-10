import { expect } from 'chai';
import Queries from '@/views/Queries';
import mockQueryLog from '../mockData/queryLog.json';
import { mountComponent, mockAxios } from '../setup';

describe('Queries log', () => {
  it('renders the query log correctly', (done) => {
    mockAxios.onGet('/api/metadata/elastalert_status').reply(200, mockQueryLog);
    let wrapper = mountComponent(Queries);

    wrapper.setData({
      queryLog: mockQueryLog.hits
    });

    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('table.el-table__body tr:nth-child(1) td:nth-child(1)').text()).to.equal('test1');
      expect(wrapper.find('table.el-table__body tr:nth-child(1) td:nth-child(2)').text()).to.not.be.empty;
      expect(wrapper.find('table.el-table__body tr:nth-child(1) td:nth-child(3)').text()).to.not.be.empty;
      expect(wrapper.find('table.el-table__body tr:nth-child(1) td:nth-child(4)').text()).to.equal('0');
      expect(wrapper.find('table.el-table__body tr:nth-child(1) td:nth-child(5)').text()).to.equal('0');
      expect(wrapper.find('table.el-table__body tr:nth-child(1) td:nth-child(6)').text()).to.equal('0.1819450855255127');
      wrapper.destroy();
      done();
    });
  });
});
