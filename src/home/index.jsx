import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

function Home() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
// const { dates, profitData, tradeData, positionData, benchmarkData } = generateMockData();
  // 模拟数据
// 生成100天的模拟数据
const generateMockData = () => {
  const dates = [];
  const profitData = [];
  const tradeData = [];
  const positionData = [];
  const benchmarkData = [];
  
  // 生成100天的日期（从2023-10-01开始）
  const startDate = new Date('2023-10-01');
  for (let i = 0; i < 120; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];
    dates.push(dateStr);
    
    // 生成盈亏数据（有正有负，范围在-1000到2000之间）
    const profit = Math.floor(Math.random() * 3000) - 1000;
    profitData.push(profit);
    
    // 生成买卖数据（有正有负，范围在-500到800之间）
    const trade = Math.floor(Math.random() * 1300) - 500;
    tradeData.push(trade);
    
    // 生成持仓数据（稳步增长的正数，范围在3000到5000之间）
    const position = Math.floor(3000 + Math.random() * 2000 + i * 5);
    positionData.push(position);
    
    // 生成基准收入数据（有正有负，范围在-2到3之间，保留一位小数）
    const benchmark = Math.round((Math.random() * 5 - 2) * 10) / 10;
    benchmarkData.push(benchmark);
  }
  
  return { dates, profitData, tradeData, positionData, benchmarkData };
};

// 使用生成的数据
const { dates, profitData, tradeData, positionData, benchmarkData } = generateMockData();

  useEffect(() => {
    // 初始化图表
    if (chartRef.current && !chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, 'dark');
    }

    // 图表配置 - 四个独立绘图区域
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: ['每日盈亏', '每日买卖', '每日持仓', '基准收入%'],
        top: 0
      },
      // 四个独立grid区域(垂直排列)
     grid: [
        { left: '8%', right: '8%', top: '10%', height: '10%' },  // 策略收益
        { left: '8%', right: '8%', top: '25%', height: '10%' },  // 盈亏
        { left: '8%', right: '8%', top: '40%', height: '10%' },  // 买卖
        { left: '8%', right: '8%', top: '55%', height: '10%' },  // 持仓
        { left: '8%', right: '8%', top: '70%', height: '12%' }   // 基准收益
      ],
      // 四个共享x轴(仅第一个显示标签)
      xAxis: [
        { type: 'category', data: dates, gridIndex: 0, axisLine: { show: false }, axisLabel: { show: false }},
        { type: 'category', data: dates, gridIndex: 1, axisLine: { show: false }, axisLabel: { show: false }},
        { type: 'category', data: dates, gridIndex: 2, axisLine: { show: false }, axisLabel: { show: false }},
        { type: 'category', data: dates, gridIndex: 3, axisLine: { show: false }, axisLabel: { show: false }},
        { type: 'category', data: dates, gridIndex: 4, axisLine: { show: true }, axisLabel: { show: true }}  // 底部显示x轴
      ],
      // 四个独立y轴
      yAxis: [
        { type: 'value', name: '策略收益', gridIndex: 0, axisLine: { show: true, lineStyle: { color: '#ff4d4f' }}},
        { type: 'value', name: '盈亏(元)', gridIndex: 1, axisLine: { show: true, lineStyle: { color: '#ff4d4f' }}},
        { type: 'value', name: '买卖(股)', gridIndex: 2, axisLine: { show: true, lineStyle: { color: '#52c41a' }}},
        { type: 'value', name: '持仓(股)', gridIndex: 3, axisLine: { show: true, lineStyle: { color: '#ff4d4f' }}},
        { type: 'value', name: '基准(%)', gridIndex: 4, axisLine: { show: true, lineStyle: { color: '#1890ff' }}}
      ],
      series: [
      // ... existing code ...
        { // 每日盈亏 - 独立区域1
          name: '每日盈亏',
          type: 'line',
          gridIndex: 0,
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: profitData,
          itemStyle: { color: params => params.data >= 0 ? '#ff4d4f' : '#52c41a' },
          // 使用markLine实现箭头标记
          markLine: {
            silent: true,
            data: function() {
              const lines = [];
              
              // 从第二个点开始检查趋势变化
              for (let i = 1; i < profitData.length; i++) {
                // 简化的趋势检测逻辑，更容易触发标记
                if (i > 0) {
                  const prevValue = profitData[i-1];
                  const currValue = profitData[i];
                  
                  // 只要有变化就标记（简化逻辑）
                  if (Math.abs(currValue - prevValue) > 100) { // 设置一个合理的阈值
                    const isUp = currValue > prevValue;
                    lines.push({
                      name: isUp ? '上涨' : '下跌',
                      // 使用正确的索引格式
                      xAxis: [i-1],
                      yAxis: [prevValue, currValue],
                      lineStyle: {
                        color: isUp ? '#ff4d4f' : '#52c41a',
                        width: 3
                      },
                      // 优化箭头设置
                      symbol: ['arrow', 'none'],
                      symbolSize: 10,
                      // label: {
                      //   show: false
                      // }
                    });
                  }
                }
              }
              return lines;
            }
          }
        },
        { // 基准收入 - 独立区域4
          name: '每日盈亏',
          type: 'bar',
          gridIndex: 1,
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: benchmarkData,
          lineStyle: { color: '#1890ff' },
          symbol: 'circle',
          itemStyle: { color: params => params.data >= 0 ? '#ff4d4f' : '#52c41a' }
        },
        { // 每日买卖 - 独立区域2
          name: '每日买卖',
          type: 'bar',
          gridIndex: 2,
          xAxisIndex: 2,
          yAxisIndex: 2,
          data: tradeData,
          itemStyle: { color: params => params.data >= 0 ? '#ff4d4f' : '#52c41a' }
        },
        { // 每日持仓 - 独立区域3
          name: '每日持仓',
          type: 'bar',
          gridIndex: 3,
          xAxisIndex: 3,
          yAxisIndex: 3,
          data: positionData,
          itemStyle: { color: '#ff4d4f' }
        },
        { // 基准收入 - 独立区域4
          name: '基准收入%',
          type: 'line',
          gridIndex: 4,
          xAxisIndex: 4,
          yAxisIndex: 4,
          data: benchmarkData,
          lineStyle: { color: '#1890ff' },
          symbol: 'circle',
          itemStyle: { color: '#1890ff' }
        }
      ]
    };

    chartInstance.current.setOption(option);

    // 响应窗口大小变化
    const resizeHandler = () => chartInstance.current.resize();
    window.addEventListener('resize', resizeHandler);

    // 清理函数
    return () => {
      window.removeEventListener('resize', resizeHandler);
      chartInstance.current.dispose();
      chartInstance.current = null;
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '700px', padding: '20px' }}>
      <h1>交易数据图表</h1>
      <div ref={chartRef} style={{ width: '100%', height: '600px' }}></div>
    </div>
  );
}

export default Home;
