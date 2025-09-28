import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Button,
  Space,
  Typography,
  Progress,
  Table,
  Tag,
  Statistic,
  Alert,
  List,
  Avatar,
} from 'antd';
import {
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  DownloadOutlined,
  AlertOutlined,
  RiseOutlined,
  FallOutlined,
  HeartOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface RiskElderly {
  id: string;
  name: string;
  room: string;
  riskType: string;
  riskLevel: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
}

const HealthAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);
  const [indicator, setIndicator] = useState('blood_pressure');

  const getOverallHealthOption = () => ({
    title: { text: '整体健康趋势', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: {
      bottom: 0,
      data: ['正常', '偏高', '异常'],
    },
    series: [
      {
        name: '健康状态',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 121, name: '正常', itemStyle: { color: '#52c41a' } },
          { value: 23, name: '偏高', itemStyle: { color: '#faad14' } },
          { value: 12, name: '异常', itemStyle: { color: '#ff4d4f' } },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  });

  const getTrendAnalysisOption = () => ({
    title: { text: '7日血压趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['收缩压', '舒张压', '平均值'],
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      type: 'value',
      name: 'mmHg',
    },
    series: [
      {
        name: '收缩压',
        type: 'line',
        smooth: true,
        data: [120, 125, 118, 135, 130, 125, 122],
        itemStyle: { color: '#ff4d4f' },
        areaStyle: { opacity: 0.1 },
      },
      {
        name: '舒张压',
        type: 'line',
        smooth: true,
        data: [80, 82, 78, 88, 85, 82, 80],
        itemStyle: { color: '#1890ff' },
        areaStyle: { opacity: 0.1 },
      },
      {
        name: '平均值',
        type: 'line',
        smooth: true,
        data: [100, 103, 98, 111, 107, 103, 101],
        itemStyle: { color: '#52c41a' },
        lineStyle: { type: 'dashed' },
      },
    ],
  });

  const getHeartRateDistributionOption = () => ({
    title: { text: '心率分布', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['<60', '60-70', '70-80', '80-90', '90-100', '>100'],
      name: 'bpm',
    },
    yAxis: {
      type: 'value',
      name: '人数',
    },
    series: [
      {
        type: 'bar',
        data: [
          { value: 5, itemStyle: { color: '#faad14' } },
          { value: 45, itemStyle: { color: '#52c41a' } },
          { value: 68, itemStyle: { color: '#52c41a' } },
          { value: 25, itemStyle: { color: '#52c41a' } },
          { value: 10, itemStyle: { color: '#faad14' } },
          { value: 3, itemStyle: { color: '#ff4d4f' } },
        ],
        barWidth: '60%',
      },
    ],
  });

  const getActivityLevelOption = () => ({
    title: { text: '活动量分析', left: 'center' },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
    },
    legend: {
      data: ['日均步数', '活动时长'],
      bottom: 0,
    },
    xAxis: [
      {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '步数',
        position: 'left',
      },
      {
        type: 'value',
        name: '小时',
        position: 'right',
      },
    ],
    series: [
      {
        name: '日均步数',
        type: 'bar',
        data: [3200, 4500, 3800, 5000, 4200, 4800, 3500],
        itemStyle: { color: '#1890ff' },
      },
      {
        name: '活动时长',
        type: 'line',
        yAxisIndex: 1,
        data: [2.5, 3.2, 2.8, 3.5, 3.0, 3.3, 2.6],
        itemStyle: { color: '#faad14' },
      },
    ],
  });

  const riskElderlyData: RiskElderly[] = [
    {
      id: '1',
      name: '李爷爷',
      room: '301房',
      riskType: '血压持续偏高',
      riskLevel: 'high',
      trend: 'up',
    },
    {
      id: '2',
      name: '王奶奶',
      room: '205房',
      riskType: '心率异常',
      riskLevel: 'high',
      trend: 'stable',
    },
    {
      id: '3',
      name: '张爷爷',
      room: '108房',
      riskType: '血糖波动大',
      riskLevel: 'medium',
      trend: 'up',
    },
    {
      id: '4',
      name: '赵奶奶',
      room: '402房',
      riskType: '活动量减少',
      riskLevel: 'medium',
      trend: 'down',
    },
    {
      id: '5',
      name: '刘爷爷',
      room: '315房',
      riskType: '睡眠质量差',
      riskLevel: 'low',
      trend: 'stable',
    },
  ];

  const getRiskLevelTag = (level: string) => {
    const config = {
      high: { color: 'error', text: '高风险' },
      medium: { color: 'warning', text: '中风险' },
      low: { color: 'success', text: '低风险' },
    };
    return <Tag color={config[level as keyof typeof config].color}>
      {config[level as keyof typeof config].text}
    </Tag>;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <RiseOutlined style={{ color: '#ff4d4f' }} />;
    if (trend === 'down') return <FallOutlined style={{ color: '#52c41a' }} />;
    return <Text type="secondary">-</Text>;
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
          <Col flex="auto">
            <Title level={4} style={{ margin: 0 }}>
              健康数据分析
            </Title>
          </Col>
          <Col>
            <Space>
              <RangePicker
                value={timeRange}
                onChange={(dates) => dates && setTimeRange(dates as [Dayjs, Dayjs])}
              />
              <Select
                value={indicator}
                onChange={setIndicator}
                style={{ width: 120 }}
              >
                <Option value="blood_pressure">血压</Option>
                <Option value="heart_rate">心率</Option>
                <Option value="blood_sugar">血糖</Option>
                <Option value="activity">活动量</Option>
              </Select>
              <Button icon={<DownloadOutlined />}>导出数据</Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="平均血压"
                value="125/82"
                suffix="mmHg"
                prefix={<HeartOutlined style={{ color: '#ff4d4f' }} />}
              />
              <Progress
                percent={78}
                strokeColor="#52c41a"
                format={() => '正常范围: 78%'}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="平均心率"
                value={75}
                suffix="bpm"
                prefix={<HeartOutlined style={{ color: '#1890ff' }} />}
              />
              <Progress
                percent={85}
                strokeColor="#52c41a"
                format={() => '正常范围: 85%'}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="日均活动量"
                value={4200}
                suffix="步"
                prefix={<LineChartOutlined style={{ color: '#faad14' }} />}
              />
              <Progress
                percent={70}
                strokeColor="#faad14"
                format={() => '达标率: 70%'}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={12}>
            <Card bordered={false}>
              <ReactECharts
                option={getOverallHealthOption()}
                style={{ height: '300px' }}
                opts={{ renderer: 'canvas' }}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card bordered={false}>
              <ReactECharts
                option={getTrendAnalysisOption()}
                style={{ height: '300px' }}
                opts={{ renderer: 'canvas' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={12}>
            <Card bordered={false}>
              <ReactECharts
                option={getHeartRateDistributionOption()}
                style={{ height: '300px' }}
                opts={{ renderer: 'canvas' }}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card bordered={false}>
              <ReactECharts
                option={getActivityLevelOption()}
                style={{ height: '300px' }}
                opts={{ renderer: 'canvas' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <WarningOutlined style={{ color: '#ff4d4f' }} />
                  <Text strong>高风险老人列表</Text>
                </Space>
              }
              bordered={false}
            >
              <List
                dataSource={riskElderlyData}
                renderItem={(item) => (
                  <List.Item
                    actions={[getTrendIcon(item.trend)]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={
                        <Space>
                          <Text strong>{item.name}</Text>
                          <Text type="secondary">{item.room}</Text>
                          {getRiskLevelTag(item.riskLevel)}
                        </Space>
                      }
                      description={item.riskType}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <AlertOutlined style={{ color: '#1890ff' }} />
                  <Text strong>AI健康预测报告</Text>
                </Space>
              }
              bordered={false}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Alert
                  message="心血管风险预警"
                  description="基于历史数据分析，3位老人存在心血管疾病风险升高趋势，建议增加监测频率"
                  type="error"
                  showIcon
                />
                <Alert
                  message="跌倒风险评估"
                  description="2位老人近期活动量明显下降，可能存在跌倒风险，建议加强护理"
                  type="warning"
                  showIcon
                />
                <Alert
                  message="整体健康趋势"
                  description="本周整体健康指标稳定，78%的老人各项指标在正常范围内"
                  type="success"
                  showIcon
                />
                <Alert
                  message="用药依从性"
                  description="5位老人存在用药不规律情况，建议加强用药提醒和监督"
                  type="info"
                  showIcon
                />
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default HealthAnalytics;