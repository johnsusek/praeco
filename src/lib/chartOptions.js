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
  tooltip: {
    triggerOn: 'click',
    confine: true,
    trigger: 'axis',
    position(pt) {
      return [pt[0], '10%'];
    }
  },
  textStyle,
  lineStyle,
  title: {
    textStyle,
    left: 'center',
    text: ''
  },
  silent: true,
  xAxis: {
    axisTick: false,
    axisLine: {
      lineStyle
    },
    silent: true,
    type: 'category',
    boundaryGap: true,
    data: [],
    axisLabel: {
      show: false
    },
    axisPointer: {
      show: false,
      triggerOn: 'click',
      type: 'shadow',
      snap: true,
      label: {
        show: false,
        margin: 0
      },
      handle: {
        show: true,
        shadowBlur: 0,
        shadowOffsetY: 0,
        margin: 12,
        size: 24,
        shadowColor: '#000',
        color: '#157ce7',
        throttle: 20
      }
    }
  },
  yAxis: {
    axisLine: {
      lineStyle
    },
    silent: true,
    axisLabel: textStyle,
    offset: 8,
    type: 'value',
    boundaryGap: [0, '90%']
  }
};
