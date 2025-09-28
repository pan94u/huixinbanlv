import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Avatar,
  Typography,
  Row,
  Col,
  Drawer,
  Descriptions,
  Badge,
  Modal,
  Form,
  message,
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  PlusOutlined,
  ExportOutlined,
  EditOutlined,
  EyeOutlined,
  PhoneOutlined,
  HomeOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { Elderly } from '../../types';
import { HealthStatus, DeviceStatus } from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;

const ElderlyManagement: React.FC = () => {
  const [data, setData] = useState<Elderly[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedElderly, setSelectedElderly] = useState<Elderly | null>(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    healthStatus: '',
    floor: '',
  });
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      const mockData: Elderly[] = Array.from({ length: 50 }, (_, index) => ({
        id: `${index + 1}`,
        name: `${['张', '李', '王', '赵', '刘'][index % 5]}${
          index % 2 === 0 ? '爷爷' : '奶奶'
        }`,
        age: 65 + Math.floor(Math.random() * 20),
        roomNumber: `${Math.floor(index / 10) + 1}0${(index % 10) + 1}`,
        healthStatus: [
          HealthStatus.NORMAL,
          HealthStatus.WARNING,
          HealthStatus.CRITICAL,
        ][index % 3],
        deviceStatus: [
          DeviceStatus.ONLINE,
          DeviceStatus.OFFLINE,
          DeviceStatus.LOW_BATTERY,
        ][index % 3],
        lastActivity: `${Math.floor(Math.random() * 60)}分钟前`,
        guardian: `${['张', '李', '王'][index % 3]}${
          index % 2 === 0 ? '先生' : '女士'
        }`,
        guardianPhone: `138${Math.floor(Math.random() * 100000000)
          .toString()
          .padStart(8, '0')}`,
        medicalHistory: ['高血压', '糖尿病', '心脏病'].slice(
          0,
          Math.floor(Math.random() * 3) + 1
        ),
        medications: ['降压药', '胰岛素', '阿司匹林'].slice(
          0,
          Math.floor(Math.random() * 3) + 1
        ),
      }));
      setData(mockData);
      setPagination((prev) => ({ ...prev, total: mockData.length }));
      setLoading(false);
    }, 500);
  };

  const getHealthStatusTag = (status: HealthStatus) => {
    const config = {
      [HealthStatus.NORMAL]: { color: 'success', text: '正常' },
      [HealthStatus.WARNING]: { color: 'warning', text: '注意' },
      [HealthStatus.CRITICAL]: { color: 'error', text: '异常' },
    };
    return (
      <Tag color={config[status].color} icon={<HeartOutlined />}>
        {config[status].text}
      </Tag>
    );
  };

  const getDeviceStatusBadge = (status: DeviceStatus) => {
    const config = {
      [DeviceStatus.ONLINE]: { status: 'success' as const, text: '在线' },
      [DeviceStatus.OFFLINE]: { status: 'error' as const, text: '离线' },
      [DeviceStatus.LOW_BATTERY]: { status: 'warning' as const, text: '低电量' },
    };
    return <Badge status={config[status].status} text={config[status].text} />;
  };

  const handleView = (record: Elderly) => {
    setSelectedElderly(record);
    setDetailDrawerVisible(true);
  };

  const handleEdit = (record: Elderly) => {
    setSelectedElderly(record);
    form.setFieldsValue(record);
    setEditModalVisible(true);
  };

  const handleEditSubmit = async (values: any) => {
    try {
      message.success('信息更新成功');
      setEditModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error('更新失败，请重试');
    }
  };

  const columns: ColumnsType<Elderly> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 120,
      render: (name, record) => (
        <Space>
          <Avatar
            icon={<UserOutlined />}
            src={record.avatar}
            style={{
              backgroundColor:
                record.age > 80 ? '#ff7875' : '#87d068',
            }}
          />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: '房间号',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      width: 100,
      render: (room) => (
        <Space>
          <HomeOutlined />
          <Text>{room}</Text>
        </Space>
      ),
    },
    {
      title: '健康状态',
      dataIndex: 'healthStatus',
      key: 'healthStatus',
      width: 120,
      render: (status) => getHealthStatusTag(status),
      filters: [
        { text: '正常', value: HealthStatus.NORMAL },
        { text: '注意', value: HealthStatus.WARNING },
        { text: '异常', value: HealthStatus.CRITICAL },
      ],
      onFilter: (value, record) => record.healthStatus === value,
    },
    {
      title: '设备状态',
      dataIndex: 'deviceStatus',
      key: 'deviceStatus',
      width: 120,
      render: (status) => getDeviceStatusBadge(status),
    },
    {
      title: '最后活动',
      dataIndex: 'lastActivity',
      key: 'lastActivity',
      width: 120,
      render: (time) => <Text type="secondary">{time}</Text>,
    },
    {
      title: '监护人',
      dataIndex: 'guardian',
      key: 'guardian',
      width: 120,
      render: (guardian, record) => (
        <Space direction="vertical" size={0}>
          <Text>{guardian}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <PhoneOutlined /> {record.guardianPhone}
          </Text>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Title level={4} style={{ margin: 0 }}>
              老人管理
            </Title>
          </Col>
          <Col>
            <Space>
              <Button type="primary" icon={<PlusOutlined />}>
                添加老人
              </Button>
              <Button icon={<ExportOutlined />}>导出数据</Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="搜索老人姓名、房间号"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="健康状态"
              style={{ width: '100%' }}
              allowClear
              onChange={(value) => setFilters({ ...filters, healthStatus: value || '' })}
            >
              <Option value="normal">正常</Option>
              <Option value="warning">注意</Option>
              <Option value="critical">异常</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="选择楼层"
              style={{ width: '100%' }}
              allowClear
              onChange={(value) => setFilters({ ...filters, floor: value || '' })}
            >
              <Option value="1">1楼</Option>
              <Option value="2">2楼</Option>
              <Option value="3">3楼</Option>
              <Option value="4">4楼</Option>
              <Option value="5">5楼</Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={data.filter(
            (item) =>
              item.name.includes(searchText) || item.roomNumber.includes(searchText)
          )}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={(pag) => setPagination(pag as TablePaginationConfig)}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Drawer
        title="老人详情"
        placement="right"
        width={600}
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
      >
        {selectedElderly && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="姓名" span={1}>
                {selectedElderly.name}
              </Descriptions.Item>
              <Descriptions.Item label="年龄" span={1}>
                {selectedElderly.age}岁
              </Descriptions.Item>
              <Descriptions.Item label="房间号" span={1}>
                {selectedElderly.roomNumber}
              </Descriptions.Item>
              <Descriptions.Item label="健康状态" span={1}>
                {getHealthStatusTag(selectedElderly.healthStatus)}
              </Descriptions.Item>
              <Descriptions.Item label="设备状态" span={2}>
                {getDeviceStatusBadge(selectedElderly.deviceStatus)}
              </Descriptions.Item>
              <Descriptions.Item label="监护人" span={1}>
                {selectedElderly.guardian}
              </Descriptions.Item>
              <Descriptions.Item label="监护人电话" span={1}>
                {selectedElderly.guardianPhone}
              </Descriptions.Item>
              <Descriptions.Item label="病史" span={2}>
                {selectedElderly.medicalHistory?.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="用药情况" span={2}>
                {selectedElderly.medications?.map((item) => (
                  <Tag key={item} color="blue">
                    {item}
                  </Tag>
                ))}
              </Descriptions.Item>
            </Descriptions>
          </Space>
        )}
      </Drawer>

      <Modal
        title="编辑老人信息"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="age"
                label="年龄"
                rules={[{ required: true, message: '请输入年龄' }]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="roomNumber"
                label="房间号"
                rules={[{ required: true, message: '请输入房间号' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="healthStatus" label="健康状态">
                <Select>
                  <Option value="normal">正常</Option>
                  <Option value="warning">注意</Option>
                  <Option value="critical">异常</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="guardian" label="监护人">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="guardianPhone" label="监护人电话">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ElderlyManagement;