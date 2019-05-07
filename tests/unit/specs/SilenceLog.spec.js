import { expect } from 'chai';
import Silences from '@/views/Silences';
import mockSilenceLog from '../mockData/silenceLog.json';
import { mountComponent, mockAxios } from '../setup';

mockAxios.onGet('/api/metadata/silence').reply(200, mockSilenceLog);

describe('Silences log', () => {
  it('renders the silence log correctly', (done) => {
    let wrapper = mountComponent(Silences);

    wrapper.setData({
      silenceLog: mockSilenceLog.hits
    });

    wrapper.vm.$nextTick(() => {
      expect(wrapper.find('table.el-table__body tr:nth-child(2) td:nth-child(1)').text()).to.equal('avgexample');
      expect(wrapper.find('table.el-table__body tr:nth-child(2) td:nth-child(2)').text()).to.not.be.empty;
      expect(wrapper.find('table.el-table__body tr:nth-child(2) td:nth-child(3)').text()).to.not.be.empty;
      expect(wrapper.find('table.el-table__body tr:nth-child(2) td:nth-child(4)').text()).to.equal('0');
      wrapper.destroy();
      done();
    });
  });
});
