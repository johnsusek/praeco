import parseDate from '@/lib/parseDate';

let textStyle = {
  fontSize: 13,
  fontWeight: '500',
  fontFamily: '"Helvetica Neue", Arial, sans-serif',
  color: '#606266'
};

let lineStyle = {
  color: '#ccc'
};

export default {
  tooltip: {},
  textStyle,
  lineStyle,
  title: {
    textStyle,
    left: 'center',
    text: ''
  },
  xAxis: {
    axisTick: false,
    axisLine: {
      lineStyle
    },
    type: 'category',
    boundaryGap: true,
    data: [],
    axisLabel: {
      show: true,
      formatter(val) {
        let momentDate = parseDate(val);
        return momentDate.format('h:mma');
      }
    }
  },
  yAxis: {
    axisLine: {
      lineStyle
    },
    axisLabel: textStyle,
    offset: 8,
    type: 'value',
    boundaryGap: [0, '5%']
  }
};
