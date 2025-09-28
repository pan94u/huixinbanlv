import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Row,
  Col,
  Select,
  Input,
  Typography,
  Modal,
  Form,
  DatePicker,
  Statistic,
  Progress,
  Timeline,
  Drawer,
  Rate,
  message,
} from 'antd';
import {
  ShoppingCartOutlined,
  SearchOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { ServiceOrder, OrderStatus, ServiceType } from '../../types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ServiceOrders: React.FC = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [form] = Form.useForm();

  useEffect(() => {
    fetchOrders();
  }, [pagination.current, pagination.pageSize, statusFilter]);

  const fetchOrders = () => {
    setLoading(true);
    setTimeout(() => {
      // 张大爷的上门送餐订单
      const zhangDayeOrder: ServiceOrder = {
        id: '999',
        orderNumber: '#2024999',
        serviceType: 'home_care' as ServiceType,
        elderlyId: '999',
        elderlyName: '张大爷',
        appointmentTime: dayjs().add(1, 'day').hour(6).minute(30).format('YYYY-MM-DD HH:mm'),
        status: 'pending_assignment' as OrderStatus,
        assignee: undefined,
        description: '上门送餐服务 - 早餐配送，包括营养粥、鸡蛋、牛奶等营养餐',
        createdAt: dayjs().format('YYYY-MM-DD HH:mm'),
        completedAt: undefined,
        rating: undefined,
      };

      const mockOrders: ServiceOrder[] = [
        zhangDayeOrder,
        ...Array.from({ length: 50 }, (_, index) => ({
          id: `${index + 1}`,
          orderNumber: `#2024${(index + 1).toString().padStart(3, '0')}`,
          serviceType: [
            'home_care',
            'medication_delivery',
            'medical_escort',
            'psychological_counseling',
            'rehabilitation',
          ][index % 5] as ServiceType,
          elderlyId: `${index + 1}`,
          elderlyName: `${['张', '李', '王', '赵', '刘'][index % 5]}${
            index % 2 === 0 ? '爷爷' : '奶奶'
          }`,
          appointmentTime: dayjs()
            .add(index % 3, 'day')
            .hour(9 + (index % 8))
            .minute(index % 2 === 0 ? 0 : 30)
            .format('YYYY-MM-DD HH:mm'),
          status: [
            'pending_confirmation',
            'pending_assignment',
            'in_progress',
            'completed',
          ][index % 4] as OrderStatus,
          assignee: index % 3 === 0 ? '护士小王' : index % 3 === 1 ? '护工小李' : undefined,
          description: '定期上门护理服务，包括测量血压、体温、用药指导等',
          createdAt: dayjs().subtract(index, 'hour').format('YYYY-MM-DD HH:mm'),
          completedAt:
            index % 4 === 3
              ? dayjs().subtract(index / 2, 'hour').format('YYYY-MM-DD HH:mm')
              : undefined,
          rating: index % 4 === 3 ? 4 + Math.random() : undefined,
        })),
      ];

      const filtered = statusFilter === 'all'
        ? mockOrders
        : mockOrders.filter(o => o.status === statusFilter);

      setOrders(filtered);
      setPagination((prev) => ({ ...prev, total: filtered.length }));
      setLoading(false);
    }, 500);
  };

  const getServiceTypeTag = (type: ServiceType) => {
    const config = {
      home_care: { color: 'blue', text: '上门护理' },
      medication_delivery: { color: 'green', text: '药品配送' },
      medical_escort: { color: 'orange', text: '陪诊服务' },
      psychological_counseling: { color: 'purple', text: '心理咨询' },
      rehabilitation: { color: 'cyan', text: '康复训练' },
    };
    return <Tag color={config[type].color}>{config[type].text}</Tag>;
  };

  const getStatusTag = (status: OrderStatus) => {
    const config = {
      pending_confirmation: { color: 'gold', text: '待确认', icon: <ClockCircleOutlined /> },
      pending_assignment: { color: 'orange', text: '待分派', icon: <UserOutlined /> },
      in_progress: { color: 'processing', text: '进行中', icon: <ClockCircleOutlined /> },
      completed: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
      cancelled: { color: 'error', text: '已取消', icon: <CloseCircleOutlined /> },
    };
    return (
      <Tag color={config[status].color} icon={config[status].icon}>
        {config[status].text}
      </Tag>
    );
  };

  const handleConfirm = (order: ServiceOrder) => {
    Modal.confirm({
      title: '确认订单',
      content: `确认接受订单 ${order.orderNumber}？`,
      onOk: () => {
        message.success('订单已确认');
        fetchOrders();
      },
    });
  };

  const handleAssign = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setAssignModalVisible(true);
  };

  const handleTrack = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setDetailDrawerVisible(true);
  };

  const handleAssignSubmit = async (values: any) => {
    try {
      message.success('订单分派成功');
      setAssignModalVisible(false);
      form.resetFields();
      fetchOrders();
    } catch (error) {
      message.error('分派失败，请重试');
    }
  };

  const columns: ColumnsType<ServiceOrder> = [
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      fixed: 'left',
      width: 120,
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: '服务类型',
      dataIndex: 'serviceType',
      key: 'serviceType',
      width: 120,
      render: (type) => getServiceTypeTag(type),
      filters: [
        { text: '上门护理', value: 'home_care' },
        { text: '药品配送', value: 'medication_delivery' },
        { text: '陪诊服务', value: 'medical_escort' },
        { text: '心理咨询', value: 'psychological_counseling' },
        { text: '康复训练', value: 'rehabilitation' },
      ],
      onFilter: (value, record) => record.serviceType === value,
    },
    {
      title: '老人姓名',
      dataIndex: 'elderlyName',
      key: 'elderlyName',
      width: 100,
      render: (name) => (
        <Space>
          <UserOutlined />
          <Text>{name}</Text>
        </Space>
      ),
    },
    {
      title: '预约时间',
      dataIndex: 'appointmentTime',
      key: 'appointmentTime',
      width: 180,
      render: (time) => (
        <Space>
          <CalendarOutlined />
          <Text>{time}</Text>
        </Space>
      ),
      sorter: (a, b) => dayjs(a.appointmentTime).unix() - dayjs(b.appointmentTime).unix(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => getStatusTag(status),
    },
    {
      title: '处理人',
      dataIndex: 'assignee',
      key: 'assignee',
      width: 120,
      render: (assignee) => assignee || '-',
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 150,
      render: (rating) =>
        rating ? <Rate disabled value={rating} style={{ fontSize: 14 }} /> : '-',
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => {
        const actions = [];

        if (record.status === 'pending_confirmation') {
          actions.push(
            <Button
              key="confirm"
              type="primary"
              size="small"
              onClick={() => handleConfirm(record)}
            >
              确认
            </Button>
          );
        }

        if (record.status === 'pending_assignment') {
          actions.push(
            <Button
              key="assign"
              size="small"
              onClick={() => handleAssign(record)}
            >
              分派
            </Button>
          );
        }

        if (record.status === 'in_progress') {
          actions.push(
            <Button
              key="track"
              size="small"
              onClick={() => handleTrack(record)}
            >
              跟踪
            </Button>
          );
        }

        actions.push(
          <Button
            key="detail"
            type="link"
            size="small"
            onClick={() => handleTrack(record)}
          >
            详情
          </Button>
        );

        return <Space>{actions}</Space>;
      },
    },
  ];

  const todayOrders = orders.filter(o =>
    dayjs(o.appointmentTime).isSame(dayjs(), 'day')
  ).length;

  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o =>
    o.status === 'pending_confirmation' || o.status === 'pending_assignment'
  ).length;

  const completionRate = orders.length > 0
    ? Math.round((completedOrders / orders.length) * 100)
    : 0;

  const averageRating = orders
    .filter(o => o.rating)
    .reduce((acc, o) => acc + (o.rating || 0), 0) /
    (orders.filter(o => o.rating).length || 1);

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col flex="auto">
            <Title level={4} style={{ margin: 0 }}>
              服务订单管理
            </Title>
          </Col>
          <Col>
            <Button icon={<ExportOutlined />}>导出订单</Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="今日订单"
                value={todayOrders}
                suffix="单"
                prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="待处理"
                value={pendingOrders}
                suffix="单"
                valueStyle={{ color: '#faad14' }}
                prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="完成率"
                value={completionRate}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
              />
              <Progress
                percent={completionRate}
                strokeColor="#52c41a"
                showInfo={false}
                style={{ marginTop: 8 }}
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
                prefix={<Rate disabled count={1} defaultValue={1} style={{ fontSize: 14 }} />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="搜索订单号、老人姓名"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="订单状态"
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="all">全部</Option>
              <Option value="pending_confirmation">待确认</Option>
              <Option value="pending_assignment">待分派</Option>
              <Option value="in_progress">进行中</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={orders.filter(
            (item) =>
              item.orderNumber.includes(searchText) ||
              item.elderlyName.includes(searchText)
          )}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={(pag) => setPagination(pag as TablePaginationConfig)}
          scroll={{ x: 1400 }}
        />
      </Card>

      <Drawer
        title="订单详情"
        placement="right"
        width={600}
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
      >
        {selectedOrder && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card title="基本信息" size="small">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text type="secondary">订单号：</Text>
                  <Text strong>{selectedOrder.orderNumber}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">状态：</Text>
                  {getStatusTag(selectedOrder.status)}
                </Col>
                <Col span={12}>
                  <Text type="secondary">服务类型：</Text>
                  {getServiceTypeTag(selectedOrder.serviceType)}
                </Col>
                <Col span={12}>
                  <Text type="secondary">老人姓名：</Text>
                  <Text>{selectedOrder.elderlyName}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">预约时间：</Text>
                  <Text>{selectedOrder.appointmentTime}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">处理人：</Text>
                  <Text>{selectedOrder.assignee || '-'}</Text>
                </Col>
              </Row>
            </Card>

            <Card title="服务详情" size="small">
              <Text>{selectedOrder.description}</Text>
            </Card>

            {selectedOrder.status !== 'pending_confirmation' && (
              <Card title="处理进度" size="small">
                <Timeline>
                  <Timeline.Item color="green">
                    订单创建 - {selectedOrder.createdAt}
                  </Timeline.Item>
                  {selectedOrder.status !== 'pending_confirmation' && (
                    <Timeline.Item color="blue">
                      订单确认 - {dayjs(selectedOrder.createdAt).add(10, 'minute').format('YYYY-MM-DD HH:mm')}
                    </Timeline.Item>
                  )}
                  {selectedOrder.assignee && (
                    <Timeline.Item color="blue">
                      分派给{selectedOrder.assignee} - {dayjs(selectedOrder.createdAt).add(20, 'minute').format('YYYY-MM-DD HH:mm')}
                    </Timeline.Item>
                  )}
                  {selectedOrder.status === 'in_progress' && (
                    <Timeline.Item color="processing" dot={<ClockCircleOutlined />}>
                      服务进行中
                    </Timeline.Item>
                  )}
                  {selectedOrder.status === 'completed' && (
                    <Timeline.Item color="green">
                      服务完成 - {selectedOrder.completedAt}
                    </Timeline.Item>
                  )}
                </Timeline>
              </Card>
            )}

            {selectedOrder.rating && (
              <Card title="服务评价" size="small">
                <Space direction="vertical">
                  <Rate disabled value={selectedOrder.rating} />
                  <Text>客户满意度良好</Text>
                </Space>
              </Card>
            )}
          </Space>
        )}
      </Drawer>

      <Modal
        title="分派订单"
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
            label="分派给"
            rules={[{ required: true, message: '请选择处理人员' }]}
          >
            <Select placeholder="选择员工">
              <Option value="护士小王">护士小王 - 护理部</Option>
              <Option value="护工小李">护工小李 - 护理部</Option>
              <Option value="医生张主任">医生张主任 - 医务部</Option>
              <Option value="康复师小刘">康复师小刘 - 康复部</Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="备注">
            <TextArea rows={3} placeholder="请输入备注信息" />
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

export default ServiceOrders;