import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Avatar,
  Typography,
  Row,
  Col,
  Input,
  Select,
  Badge,
  Modal,
  Form,
  Statistic,
  Progress,
  message,
} from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  StarOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { Staff, StaffStatus } from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [form] = Form.useForm();

  useEffect(() => {
    fetchStaff();
  }, [pagination.current, pagination.pageSize, departmentFilter]);

  const fetchStaff = () => {
    setLoading(true);
    setTimeout(() => {
      const mockStaff: Staff[] = [
        {
          id: '1',
          name: '李护士',
          department: '护理部',
          position: '主管护士',
          status: StaffStatus.ONLINE,
          taskCount: 3,
          phone: '13800138001',
          email: 'li.nurse@hospital.com',
          rating: 4.8,
        },
        {
          id: '2',
          name: '王医生',
          department: '医务部',
          position: '主治医师',
          status: StaffStatus.ONLINE,
          taskCount: 2,
          phone: '13800138002',
          email: 'wang.doctor@hospital.com',
          rating: 4.9,
        },
        {
          id: '3',
          name: '张护工',
          department: '护理部',
          position: '护理员',
          status: StaffStatus.OFFLINE,
          taskCount: 0,
          phone: '13800138003',
          email: 'zhang.worker@hospital.com',
          rating: 4.7,
        },
        {
          id: '4',
          name: '刘社工',
          department: '社工部',
          position: '社工师',
          status: StaffStatus.ONLINE,
          taskCount: 1,
          phone: '13800138004',
          email: 'liu.social@hospital.com',
          rating: 4.7,
        },
        {
          id: '5',
          name: '陈护士',
          department: '护理部',
          position: '护士',
          status: StaffStatus.BUSY,
          taskCount: 5,
          phone: '13800138005',
          email: 'chen.nurse@hospital.com',
          rating: 4.6,
        },
        {
          id: '6',
          name: '赵医生',
          department: '医务部',
          position: '副主任医师',
          status: StaffStatus.ONLINE,
          taskCount: 1,
          phone: '13800138006',
          email: 'zhao.doctor@hospital.com',
          rating: 4.9,
        },
        {
          id: '7',
          name: '孙护工',
          department: '护理部',
          position: '护理员',
          status: StaffStatus.ONLINE,
          taskCount: 2,
          phone: '13800138007',
          email: 'sun.worker@hospital.com',
          rating: 4.5,
        },
        {
          id: '8',
          name: '周康复师',
          department: '康复部',
          position: '康复治疗师',
          status: StaffStatus.ONLINE,
          taskCount: 4,
          phone: '13800138008',
          email: 'zhou.rehab@hospital.com',
          rating: 4.8,
        },
        {
          id: '9',
          name: '吴营养师',
          department: '营养部',
          position: '营养师',
          status: StaffStatus.OFFLINE,
          taskCount: 0,
          phone: '13800138009',
          email: 'wu.nutrition@hospital.com',
          rating: 4.7,
        },
        {
          id: '10',
          name: '郑心理师',
          department: '心理部',
          position: '心理咨询师',
          status: StaffStatus.ONLINE,
          taskCount: 3,
          phone: '13800138010',
          email: 'zheng.psych@hospital.com',
          rating: 4.8,
        },
      ];

      const filtered = departmentFilter === 'all'
        ? mockStaff
        : mockStaff.filter(s => s.department === departmentFilter);

      setStaff(filtered);
      setPagination((prev) => ({ ...prev, total: filtered.length }));
      setLoading(false);
    }, 500);
  };

  const getStatusBadge = (status: StaffStatus) => {
    const config = {
      [StaffStatus.ONLINE]: { status: 'success' as const, text: '在线' },
      [StaffStatus.OFFLINE]: { status: 'error' as const, text: '离线' },
      [StaffStatus.BUSY]: { status: 'warning' as const, text: '忙碌' },
    };
    return <Badge status={config[status].status} text={config[status].text} />;
  };

  const getDepartmentColor = (department: string) => {
    const colors: { [key: string]: string } = {
      '护理部': 'blue',
      '医务部': 'green',
      '社工部': 'purple',
      '康复部': 'cyan',
      '营养部': 'orange',
      '心理部': 'magenta',
    };
    return colors[department] || 'default';
  };

  const handleAddStaff = async (values: any) => {
    try {
      message.success('员工添加成功');
      setAddModalVisible(false);
      form.resetFields();
      fetchStaff();
    } catch (error) {
      message.error('添加失败，请重试');
    }
  };

  const handleSchedule = (record: Staff) => {
    message.info(`正在为 ${record.name} 安排排班`);
  };

  const columns: ColumnsType<Staff> = [
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
            style={{ backgroundColor: '#87d068' }}
          />
          <Text strong>{name}</Text>
        </Space>
      ),
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 100,
      render: (dept) => (
        <Tag color={getDepartmentColor(dept)}>{dept}</Tag>
      ),
      filters: [
        { text: '护理部', value: '护理部' },
        { text: '医务部', value: '医务部' },
        { text: '社工部', value: '社工部' },
        { text: '康复部', value: '康复部' },
        { text: '营养部', value: '营养部' },
        { text: '心理部', value: '心理部' },
      ],
      onFilter: (value, record) => record.department === value,
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      width: 120,
    },
    {
      title: '在线状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusBadge(status),
      filters: [
        { text: '在线', value: StaffStatus.ONLINE },
        { text: '离线', value: StaffStatus.OFFLINE },
        { text: '忙碌', value: StaffStatus.BUSY },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '当前任务',
      dataIndex: 'taskCount',
      key: 'taskCount',
      width: 100,
      render: (count) => (
        <Tag color={count > 3 ? 'red' : count > 0 ? 'blue' : 'default'}>
          {count} 个任务
        </Tag>
      ),
      sorter: (a, b) => a.taskCount - b.taskCount,
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 12 }}>
            <PhoneOutlined /> {record.phone}
          </Text>
          <Text style={{ fontSize: 12 }}>
            <MailOutlined /> {record.email}
          </Text>
        </Space>
      ),
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
      render: (rating) => (
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          <Text>{rating?.toFixed(1)}</Text>
        </Space>
      ),
      sorter: (a, b) => (a.rating || 0) - (b.rating || 0),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small">
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<CalendarOutlined />}
            onClick={() => handleSchedule(record)}
          >
            排班
          </Button>
        </Space>
      ),
    },
  ];

  const onlineStaff = staff.filter(s => s.status === StaffStatus.ONLINE).length;
  const busyStaff = staff.filter(s => s.status === StaffStatus.BUSY).length;
  const totalTasks = staff.reduce((acc, s) => acc + s.taskCount, 0);
  const averageRating = staff.reduce((acc, s) => acc + (s.rating || 0), 0) / (staff.length || 1);

  const departmentStats = {
    '护理部': staff.filter(s => s.department === '护理部').length,
    '医务部': staff.filter(s => s.department === '医务部').length,
    '社工部': staff.filter(s => s.department === '社工部').length,
    '康复部': staff.filter(s => s.department === '康复部').length,
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col flex="auto">
            <Title level={4} style={{ margin: 0 }}>
              员工管理
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddModalVisible(true)}
            >
              添加员工
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="在线员工"
                value={onlineStaff}
                suffix={`/ ${staff.length}`}
                prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
              />
              <Progress
                percent={Math.round((onlineStaff / (staff.length || 1)) * 100)}
                strokeColor="#52c41a"
                showInfo={false}
                style={{ marginTop: 8 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="忙碌员工"
                value={busyStaff}
                suffix="人"
                valueStyle={{ color: '#faad14' }}
                prefix={<UserOutlined style={{ color: '#faad14' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="处理任务"
                value={totalTasks}
                suffix="个"
                prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="平均评分"
                value={averageRating}
                precision={1}
                suffix="分"
                prefix={<StarOutlined style={{ color: '#faad14' }} />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="搜索员工姓名"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="选择部门"
              style={{ width: '100%' }}
              value={departmentFilter}
              onChange={setDepartmentFilter}
            >
              <Option value="all">全部部门</Option>
              <Option value="护理部">护理部</Option>
              <Option value="医务部">医务部</Option>
              <Option value="社工部">社工部</Option>
              <Option value="康复部">康复部</Option>
              <Option value="营养部">营养部</Option>
              <Option value="心理部">心理部</Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={staff.filter((item) =>
            item.name.includes(searchText)
          )}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={(pag) => setPagination(pag as TablePaginationConfig)}
          scroll={{ x: 1200 }}
        />

        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="部门员工统计" size="small">
              <Row gutter={[16, 16]}>
                {Object.entries(departmentStats).map(([dept, count]) => (
                  <Col xs={12} sm={6} key={dept}>
                    <Statistic
                      title={dept}
                      value={count}
                      suffix="人"
                      valueStyle={{ fontSize: 20 }}
                    />
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>

      <Modal
        title="添加员工"
        open={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleAddStaff}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入员工姓名' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="部门"
                rules={[{ required: true, message: '请选择部门' }]}
              >
                <Select>
                  <Option value="护理部">护理部</Option>
                  <Option value="医务部">医务部</Option>
                  <Option value="社工部">社工部</Option>
                  <Option value="康复部">康复部</Option>
                  <Option value="营养部">营养部</Option>
                  <Option value="心理部">心理部</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="position"
                label="职位"
                rules={[{ required: true, message: '请输入职位' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="电话"
                rules={[{ required: true, message: '请输入电话号码' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => setAddModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffManagement;