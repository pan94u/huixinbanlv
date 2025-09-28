import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Space,
  Typography,
  Tag,
  List,
  Avatar,
  Progress,
  Alert,
} from 'antd';
import {
  UserOutlined,
  AlertOutlined,
  ShoppingCartOutlined,
  WifiOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  WarningOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  ExclamationOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import type { Alert as AlertType, Room } from '../../types';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const mockAlerts: AlertType[] = [
      {
        id: '1',
        type: 'fall',
        level: 'emergency',
        elderlyId: '1',
        elderlyName: '张奶奶',
        location: '301房',
        message: '跌倒预警',
        timestamp: '14:30',
        status: 'pending',
      },
      {
        id: '2',
        type: 'blood_pressure',
        level: 'warning',
        elderlyId: '2',
        elderlyName: '李爷爷',
        location: '205房',
        message: '血压异常',
        timestamp: '14:25',
        status: 'pending',
      },
      {
        id: '3',
        type: 'medication',
        level: 'info',
        elderlyId: '3',
        elderlyName: '王奶奶',
        location: '108房',
        message: '用药逾期',
        timestamp: '13:45',
        status: 'pending',
      },
    ];
    setAlerts(mockAlerts);
  }, []);

  const getHealthTrendOption = () => ({
    title: { text: '健康趋势分析', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['血压', '心率', '活动量'],
      bottom: 0,
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: '血压',
        type: 'line',
        data: [120, 125, 118, 135, 130, 125, 122],
        smooth: true,
        itemStyle: { color: '#1890ff' },
      },
      {
        name: '心率',
        type: 'line',
        data: [75, 78, 72, 80, 76, 74, 73],
        smooth: true,
        itemStyle: { color: '#52c41a' },
      },
      {
        name: '活动量',
        type: 'line',
        data: [3000, 4500, 3800, 5000, 4200, 4800, 3500],
        smooth: true,
        itemStyle: { color: '#faad14' },
      },
    ],
  });

  const getFloorDistributionOption = () => ({
    title: { text: '楼层分布图', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: {
      data: ['正常', '警告', '紧急'],
      bottom: 0,
    },
    series: [
      {
        name: '老人状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 145, name: '正常', itemStyle: { color: '#52c41a' } },
          { value: 8, name: '警告', itemStyle: { color: '#faad14' } },
          { value: 3, name: '紧急', itemStyle: { color: '#ff4d4f' } },
        ],
      },
    ],
  });

  const getAlertIcon = (type: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      fall: <ExclamationOutlined style={{ color: '#ff4d4f' }} />,
      blood_pressure: <HeartOutlined style={{ color: '#faad14' }} />,
      medication: <MedicineBoxOutlined style={{ color: '#1890ff' }} />,
    };
    return icons[type] || <WarningOutlined />;
  };

  const getAlertLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      emergency: 'error',
      warning: 'warning',
      info: 'processing',
    };
    return colors[level] || 'default';
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>总览仪表盘</Title>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="在册老人"
              value={156}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              suffix="人"
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">较昨日</Text>
              <Text style={{ marginLeft: 8, color: '#52c41a' }}>
                <ArrowUpOutlined /> 2
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="今日预警"
              value={8}
              prefix={<AlertOutlined style={{ color: '#faad14' }} />}
              suffix="条"
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">紧急: 3</Text>
              <Text type="secondary" style={{ marginLeft: 8 }}>
                一般: 5
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="待处理订单"
              value={12}
              prefix={<ShoppingCartOutlined style={{ color: '#fa8c16' }} />}
              suffix="个"
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">今日新增</Text>
              <Text style={{ marginLeft: 8, color: '#fa8c16' }}>
                <ArrowUpOutlined /> 5
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="设备在线率"
              value={94}
              prefix={<WifiOutlined style={{ color: '#52c41a' }} />}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress
              percent={94}
              strokeColor="#52c41a"
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="健康趋势分析" bordered={false}>
            <ReactECharts
              option={getHealthTrendOption()}
              style={{ height: '300px' }}
              opts={{ renderer: 'canvas' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="实时位置监控" bordered={false}>
            <ReactECharts
              option={getFloorDistributionOption()}
              style={{ height: '300px' }}
              opts={{ renderer: 'canvas' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <WarningOutlined style={{ color: '#ff4d4f' }} />
                <Text strong>紧急预警 (实时)</Text>
              </Space>
            }
            bordered={false}
          >
            <List
              dataSource={alerts}
              loading={loading}
              renderItem={(alert) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getAlertIcon(alert.type)}
                    title={
                      <Space>
                        <Tag color={getAlertLevelColor(alert.level)}>
                          {alert.level === 'emergency' ? '紧急' :
                           alert.level === 'warning' ? '警告' : '一般'}
                        </Tag>
                        <Text strong>{alert.location}</Text>
                        <Text>{alert.elderlyName}</Text>
                      </Space>
                    }
                    description={
                      <Space>
                        <Text type="secondary">{alert.message}</Text>
                        <Text type="secondary">·</Text>
                        <Text type="secondary">{alert.timestamp}</Text>
                      </Space>
                    }
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
                <HeartOutlined style={{ color: '#1890ff' }} />
                <Text strong>AI健康预测</Text>
              </Space>
            }
            bordered={false}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Alert
                message="本周高风险老人: 5位"
                description="基于健康数据分析，建议重点关注301房张大爷、205房李奶奶"
                type="warning"
                showIcon
              />
              <Alert
                message="预测住院风险: 3位"
                description="心血管疾病风险升高，建议及时干预"
                type="info"
                showIcon
              />
              <Alert
                message="情绪异常预警: 2位"
                description="检测到108房王爷爷、402房赵奶奶情绪波动较大"
                type="info"
                showIcon
              />
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;