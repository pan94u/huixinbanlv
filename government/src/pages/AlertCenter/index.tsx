import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Space,
  Typography,
  Tag,
  List,
  Badge,
  Select,
  Modal,
  Form,
  Input,
  DatePicker,
  Radio,
  message,
  Tabs,
  Timeline,
  Empty,
} from 'antd';
import {
  AlertOutlined,
  PhoneOutlined,
  UserAddOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  ThunderboltOutlined,
  MoonOutlined,
  FrownOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { Alert as AlertType, AlertLevel, AlertStatus } from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const AlertCenter: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<AlertType[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | AlertLevel | AlertStatus>('all');
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, filter]);

  const fetchAlerts = () => {
    setLoading(true);
    setTimeout(() => {
      const mockAlerts: AlertType[] = [
        {
          id: '8',
          type: 'emotion',
          level: 'warning',
          elderlyId: '8',
          elderlyName: '张大爷',
          location: '203房',
          message: '情绪波动异常',
          timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
          status: 'resolved',
          handler: '心理咨询师小王',
          handledAt: new Date(Date.now() - 60 * 60000).toISOString(),
        },
        {
          id: '1',
          type: 'fall',
          level: 'emergency',
          elderlyId: '1',
          elderlyName: '张大爷',
          location: '301房',
          message: '检测到跌倒，请立即处理',
          timestamp: new Date().toISOString(),
          status: 'pending',
        },
        {
          id: '2',
          type: 'blood_pressure',
          level: 'emergency',
          elderlyId: '2',
          elderlyName: '李奶奶',
          location: '205房',
          message: '血压异常升高 (180/110)',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          status: 'in_progress',
          handler: '护士小王',
        },
        {
          id: '3',
          type: 'heart_rate',
          level: 'warning',
          elderlyId: '3',
          elderlyName: '王爷爷',
          location: '108房',
          message: '心率过快 (110 bpm)',
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
          status: 'pending',
        },
        {
          id: '4',
          type: 'medication',
          level: 'info',
          elderlyId: '4',
          elderlyName: '赵奶奶',
          location: '402房',
          message: '用药提醒逾期2小时',
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
          status: 'resolved',
          handler: '护工小李',
          handledAt: new Date(Date.now() - 10 * 60000).toISOString(),
        },
        {
          id: '5',
          type: 'device',
          level: 'info',
          elderlyId: '5',
          elderlyName: '刘爷爷',
          location: '315房',
          message: '设备电量低于20%',
          timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
          status: 'resolved',
          handler: '技术员小张',
          handledAt: new Date(Date.now() - 20 * 60000).toISOString(),
        },
        {
          id: '6',
          type: 'emotion',
          level: 'warning',
          elderlyId: '6',
          elderlyName: '孙奶奶',
          location: '203房',
          message: '情绪异常，可能存在抑郁倾向',
          timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
          status: 'in_progress',
          handler: '社工小陈',
        },
        {
          id: '7',
          type: 'sleep',
          level: 'info',
          elderlyId: '7',
          elderlyName: '周爷爷',
          location: '501房',
          message: '睡眠质量差，夜间多次醒来',
          timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
          status: 'pending',
        },
      ];
      setAlerts(mockAlerts);
      setLoading(false);
    }, 500);
  };

  const filterAlerts = () => {
    if (filter === 'all') {
      setFilteredAlerts(alerts);
    } else if (['emergency', 'warning', 'info'].includes(filter)) {
      setFilteredAlerts(alerts.filter((a) => a.level === filter));
    } else {
      setFilteredAlerts(alerts.filter((a) => a.status === filter));
    }
  };

  const getAlertIcon = (type: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      fall: <WarningOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />,
      blood_pressure: <HeartOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />,
      heart_rate: <HeartOutlined style={{ fontSize: 20, color: '#faad14' }} />,
      medication: <MedicineBoxOutlined style={{ fontSize: 20, color: '#1890ff' }} />,
      device: <ThunderboltOutlined style={{ fontSize: 20, color: '#595959' }} />,
      emotion: <FrownOutlined style={{ fontSize: 20, color: '#faad14' }} />,
      sleep: <MoonOutlined style={{ fontSize: 20, color: '#1890ff' }} />,
    };
    return icons[type] || <AlertOutlined style={{ fontSize: 20 }} />;
  };

  const getLevelTag = (level: AlertLevel) => {
    const config = {
      emergency: { color: 'error', text: '紧急' },
      warning: { color: 'warning', text: '警告' },
      info: { color: 'processing', text: '一般' },
    };
    return <Tag color={config[level].color}>{config[level].text}</Tag>;
  };

  const getStatusBadge = (status: AlertStatus) => {
    const config = {
      pending: { status: 'error' as const, text: '待处理' },
      in_progress: { status: 'processing' as const, text: '处理中' },
      resolved: { status: 'success' as const, text: '已处理' },
    };
    return <Badge status={config[status].status} text={config[status].text} />;
  };

  const handleAssign = (alert: AlertType) => {
    setSelectedAlert(alert);
    setAssignModalVisible(true);
  };

  const handleContact = (alert: AlertType) => {
    Modal.confirm({
      title: '联系医生',
      content: `确定要为${alert.elderlyName}联系医生吗？`,
      onOk: () => {
        message.success('已通知值班医生');
      },
    });
  };

  const handleResolve = (alert: AlertType) => {
    Modal.confirm({
      title: '标记为已处理',
      content: '确定该预警已经处理完成？',
      onOk: () => {
        const updatedAlerts = alerts.map((a) =>
          a.id === alert.id
            ? { ...a, status: 'resolved' as AlertStatus, handledAt: new Date().toISOString() }
            : a
        );
        setAlerts(updatedAlerts);
        message.success('预警已标记为处理完成');
      },
    });
  };

  const handleAssignSubmit = async (values: any) => {
    try {
      message.success('任务分派成功');
      setAssignModalVisible(false);
      form.resetFields();
      if (selectedAlert) {
        const updatedAlerts = alerts.map((a) =>
          a.id === selectedAlert.id
            ? { ...a, status: 'in_progress' as AlertStatus, handler: values.assignee }
            : a
        );
        setAlerts(updatedAlerts);
      }
    } catch (error) {
      message.error('分派失败，请重试');
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return '刚刚';
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
    return date.toLocaleString('zh-CN');
  };

  const emergencyAlerts = alerts.filter((a) => a.level === 'emergency' && a.status !== 'resolved');
  const warningAlerts = alerts.filter((a) => a.level === 'warning' && a.status !== 'resolved');
  const infoAlerts = alerts.filter((a) => a.level === 'info' && a.status !== 'resolved');
  const resolvedAlerts = alerts.filter((a) => a.status === 'resolved').slice(0, 10);

  return (
    <div style={{ padding: '24px', height: '100%', overflow: 'auto' }}>
      <Card>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
          <Col flex="auto">
            <Title level={4} style={{ margin: 0 }}>
              预警中心
            </Title>
          </Col>
          <Col>
            <Space>
              <Select
                value={filter}
                onChange={setFilter}
                style={{ width: 120 }}
              >
                <Option value="all">全部</Option>
                <Option value="emergency">紧急</Option>
                <Option value="warning">警告</Option>
                <Option value="info">一般</Option>
                <Option value="pending">待处理</Option>
                <Option value="in_progress">处理中</Option>
                <Option value="resolved">已处理</Option>
              </Select>
              <Button onClick={fetchAlerts}>刷新</Button>
            </Space>
          </Col>
        </Row>

        {emergencyAlerts.length > 0 && (
          <Card
            title={
              <Space>
                <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                <Text strong>紧急预警</Text>
                <Badge count={emergencyAlerts.length} style={{ backgroundColor: '#ff4d4f' }} />
              </Space>
            }
            style={{ marginBottom: 16, borderColor: '#ff4d4f' }}
            type="inner"
          >
            <List
              dataSource={emergencyAlerts}
              renderItem={(alert) => (
                <List.Item
                  actions={[
                    <Button
                      type="primary"
                      danger
                      size="small"
                      onClick={() => handleResolve(alert)}
                    >
                      立即处理
                    </Button>,
                    <Button
                      size="small"
                      icon={<UserAddOutlined />}
                      onClick={() => handleAssign(alert)}
                    >
                      分派任务
                    </Button>,
                    <Button
                      size="small"
                      icon={<PhoneOutlined />}
                      onClick={() => handleContact(alert)}
                    >
                      联系医生
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={getAlertIcon(alert.type)}
                    title={
                      <Space>
                        {getLevelTag(alert.level)}
                        <Text strong>{alert.location}</Text>
                        <Text>{alert.elderlyName}</Text>
                        {getStatusBadge(alert.status)}
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={0}>
                        <Text>{alert.message}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatTime(alert.timestamp)}
                          {alert.handler && ` · 处理人: ${alert.handler}`}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        )}

        {warningAlerts.length > 0 && (
          <Card
            title={
              <Space>
                <AlertOutlined style={{ color: '#faad14' }} />
                <Text strong>一般预警</Text>
                <Badge count={warningAlerts.length} style={{ backgroundColor: '#faad14' }} />
              </Space>
            }
            style={{ marginBottom: 16 }}
            type="inner"
          >
            <List
              dataSource={warningAlerts}
              renderItem={(alert) => (
                <List.Item
                  actions={[
                    <Button
                      size="small"
                      icon={<EyeOutlined />}
                    >
                      查看详情
                    </Button>,
                    <Button
                      size="small"
                      icon={<CheckOutlined />}
                      onClick={() => handleResolve(alert)}
                    >
                      标记处理
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={getAlertIcon(alert.type)}
                    title={
                      <Space>
                        {getLevelTag(alert.level)}
                        <Text strong>{alert.location}</Text>
                        <Text>{alert.elderlyName}</Text>
                        {getStatusBadge(alert.status)}
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={0}>
                        <Text>{alert.message}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatTime(alert.timestamp)}
                          {alert.handler && ` · 处理人: ${alert.handler}`}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        )}

        <Card
          title={
            <Space>
              <ClockCircleOutlined style={{ color: '#52c41a' }} />
              <Text strong>处理记录</Text>
            </Space>
          }
          type="inner"
        >
          {resolvedAlerts.length > 0 ? (
            <Timeline>
              {resolvedAlerts.map((alert) => (
                <Timeline.Item
                  key={alert.id}
                  color="green"
                  dot={<CheckOutlined />}
                >
                  <Space direction="vertical" size={0}>
                    <Space>
                      <Text strong>{alert.elderlyName}</Text>
                      <Text>{alert.location}</Text>
                      <Text type="secondary">{alert.message}</Text>
                    </Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {alert.handler} 处理于 {formatTime(alert.handledAt!)}
                    </Text>
                  </Space>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <Empty description="暂无处理记录" />
          )}
        </Card>
      </Card>

      <Modal
        title="分派任务"
        open={assignModalVisible}
        onCancel={() => {
          setAssignModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleAssignSubmit}>
          <Form.Item
            name="assignee"
            label="指派给"
            rules={[{ required: true, message: '请选择处理人员' }]}
          >
            <Select placeholder="选择员工">
              <Option value="护士小王">护士小王 - 护理部</Option>
              <Option value="医生张主任">医生张主任 - 医务部</Option>
              <Option value="护工小李">护工小李 - 护理部</Option>
              <Option value="社工小陈">社工小陈 - 社工部</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Radio.Group>
              <Radio value="high">紧急</Radio>
              <Radio value="medium">一般</Radio>
              <Radio value="low">较低</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="description" label="任务描述">
            <TextArea rows={3} placeholder="请描述具体任务内容" />
          </Form.Item>

          <Form.Item name="deadline" label="截止时间">
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                确认分派
              </Button>
              <Button onClick={() => setAssignModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AlertCenter;