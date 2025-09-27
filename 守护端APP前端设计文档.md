# "智伴关爱" 守护端APP - 前端设计文档

## 1. 产品概述

**产品名称**：智伴关爱  
**目标用户**：35-55岁工作繁忙的成年子女  
**核心价值**：让子女随时掌握父母状况，提供便捷的远程照护和专业服务对接

## 2. 技术架构

### 2.1 技术栈（Web版）
- **前端框架**：React + TypeScript
- **状态管理**：Zustand（轻量级状态管理）
- **UI组件库**：Ant Design + 自定义组件
- **图表库**：ECharts（健康数据可视化）
- **PWA支持**：离线使用 + 推送通知
- **地图服务**：高德地图Web API
- **实时通信**：WebSocket + Server-Sent Events

### 2.2 Web版优势
- **快速开发**：11周完成MVP版本
- **跨平台访问**：手机、电脑、平板通用
- **实时更新**：功能更新无需下载
- **成本控制**：开发和维护成本低
- **易于推广**：分享链接即可使用

## 3. 页面设计规范

### 3.1 主页面（Dashboard）

#### 布局结构
```
┌─────────────────────────────┐
│ 智伴关爱    🔔3    ⚙️      │ 导航栏
├─────────────────────────────┤
│  👤 爸爸妈妈  在线 ●        │ 状态卡片
│  [一键通话] [发送留言]      │
├─────────────────────────────┤
│ 📊 今日健康概览              │ 数据卡片
│ 血压: 120/80 ✅ 心率: 72   │
├─────────────────────────────┤
│ ⚠️ 安全动态 (2条未读)       │ 预警卡片
│ 🚨 昨日22:30 一键呼救      │
├─────────────────────────────┤
│ 📅 今日提醒 (3项)           │ 提醒卡片
│ 💊 09:00 服用降压药 ✅     │
├─────────────────────────────┤
│ 🏥 服务预约                 │ 服务卡片
│ [预约上门护理] [查看订单]   │
└─────────────────────────────┘
```

#### 核心功能
- **实时状态**：父母设备在线状态、位置信息
- **快捷通信**：一键通话、语音留言
- **健康概览**：关键健康指标一目了然
- **智能预警**：异常情况及时推送

#### 状态管理
```javascript
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    parentStatus: {
      isOnline: true,
      lastSeen: '2分钟前',
      location: '家中',
      deviceBattery: 85
    },
    healthSummary: {
      bloodPressure: { systolic: 120, diastolic: 80, status: 'normal' },
      heartRate: { value: 72, status: 'normal' },
      lastUpdate: '10分钟前'
    },
    alerts: [],
    reminders: [],
    unreadCount: 0
  }
});
```

### 3.2 健康数据页面（Health Data）

#### 布局结构
```
┌─────────────────────────────┐
│ ← 健康数据    日 周 月      │ 导航+时间切换
├─────────────────────────────┤
│     血压趋势图               │ 主图表区
│  ┌─────────────────────┐    │
│  │  ╱╲    ╱╲          │    │
│  │ ╱  ╲  ╱  ╲         │    │
│  │╱    ╲╱    ╲        │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│ 💓 心率  😴 睡眠  🚶 步数   │ 指标切换
├─────────────────────────────┤
│ 📋 最新数据                 │ 数据列表
│ 今日 09:30  血压 125/82    │
│ 昨日 20:15  心率 68        │
├─────────────────────────────┤
│ [生成健康报告] [设置提醒]   │ 操作按钮
└─────────────────────────────┘
```

#### 核心功能
- **数据可视化**：清晰的趋势图表
- **多维度分析**：血压、心率、睡眠、运动
- **异常标记**：超标数据高亮显示
- **报告生成**：AI分析健康趋势

#### 图表组件设计
```jsx
const HealthChart = ({ data, type, timeRange }) => {
  const chartData = useMemo(() => 
    formatHealthData(data, type, timeRange), [data, type, timeRange]
  );

  return (
    <View style={styles.chartContainer}>
      <VictoryChart
        theme={VictoryTheme.material}
        height={200}
        padding={{ left: 60, top: 20, right: 40, bottom: 40 }}
      >
        <VictoryLine
          data={chartData}
          style={{
            data: { stroke: "#007AFF", strokeWidth: 3 }
          }}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 }
          }}
        />
        <VictoryScatter
          data={chartData}
          size={4}
          style={{ data: { fill: "#007AFF" } }}
        />
      </VictoryChart>
    </View>
  );
};
```

### 3.3 预警中心页面（Alert Center）

#### 布局结构
```
┌─────────────────────────────┐
│ ← 安全动态   全部 未读 已处理│ 导航+筛选
├─────────────────────────────┤
│ 🚨 紧急呼救                 │ 紧急预警
│ 今日 14:30 | 📍 客厅        │
│ [立即回拨] [查看详情]       │
├─────────────────────────────┤
│ ⚠️ 长时间未活动              │ 一般预警
│ 今日 10:15 | 📍 卧室        │
│ [视频通话] [标记已读]       │
├─────────────────────────────┤
│ 💊 用药提醒未确认            │ 提醒预警
│ 今日 09:00 | 降压药          │
│ [语音提醒] [标记已读]       │
├─────────────────────────────┤
│ 🔋 设备电量低                │ 设备预警
│ 昨日 23:45 | 电量15%        │
│ [充电提醒] [标记已读]       │
└─────────────────────────────┘
```

#### 核心功能
- **分级预警**：紧急、重要、一般三级分类
- **快速响应**：一键回拨、视频通话
- **位置信息**：精确显示事发位置
- **处理跟踪**：预警处理状态管理

#### 预警处理流程
```javascript
const handleEmergencyAlert = async (alertId) => {
  try {
    // 1. 标记预警为处理中
    dispatch(updateAlertStatus({ id: alertId, status: 'processing' }));
    
    // 2. 获取详细信息
    const alertDetail = await API.getAlertDetail(alertId);
    
    // 3. 显示处理选项
    showActionSheet({
      options: ['立即回拨', '视频通话', '联系120', '通知其他家人'],
      onSelect: (action) => executeEmergencyAction(action, alertDetail)
    });
  } catch (error) {
    showError('处理预警失败，请重试');
  }
};
```

### 3.4 服务预约页面（Service Booking）

#### 布局结构
```
┌─────────────────────────────┐
│ ← 服务预约   预约记录 服务列表│ 导航+切换
├─────────────────────────────┤
│ 🏥 上门护理                 │ 服务卡片1
│ ¥180/次 | ⭐4.8 (128评价)   │
│ 专业护士上门，血压测量...   │
│ [立即预约]                  │
├─────────────────────────────┤
│ 💊 药品配送                 │ 服务卡片2
│ ¥15/次 | ⭐4.9 (89评价)     │
│ 1小时内送达，支持医保...    │
│ [立即预约]                  │
├─────────────────────────────┤
│ 🧠 心理咨询                 │ 服务卡片3
│ ¥200/小时 | ⭐4.7 (45评价)  │
│ 专业心理师，视频咨询...     │
│ [立即预约]                  │
├─────────────────────────────┤
│ 🚗 陪诊服务                 │ 服务卡片4
│ ¥120/次 | ⭐4.6 (67评价)    │
│ 专人陪同就医，全程服务...   │
│ [立即预约]                  │
└─────────────────────────────┘
```

#### 核心功能
- **服务展示**：价格、评价、服务内容
- **在线预约**：选择时间、地址、备注
- **订单管理**：查看预约状态、历史记录
- **支付集成**：支持多种支付方式

#### 预约流程组件
```jsx
const BookingFlow = ({ serviceId }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({});

  const steps = [
    { title: '选择时间', component: TimeSelector },
    { title: '确认地址', component: AddressSelector },
    { title: '填写需求', component: RequirementForm },
    { title: '确认支付', component: PaymentConfirm }
  ];

  return (
    <View style={styles.bookingContainer}>
      <ProgressBar current={step} total={steps.length} />
      {React.createElement(steps[step - 1].component, {
        data: bookingData,
        onNext: (data) => {
          setBookingData({ ...bookingData, ...data });
          setStep(step + 1);
        },
        onBack: () => setStep(step - 1)
      })}
    </View>
  );
};
```

### 3.5 设置页面（Settings）

#### 布局结构
```
┌─────────────────────────────┐
│ ← 设置                      │ 导航
├─────────────────────────────┤
│ 👤 家人信息                 │ 用户设置
│ 爸爸妈妈 | 编辑资料 >       │
├─────────────────────────────┤
│ 🔔 通知设置                 │ 通知设置
│ 紧急预警 ✅ | 健康提醒 ✅   │
├─────────────────────────────┤
│ 📱 设备管理                 │ 设备设置
│ 智伴设备 在线 | 查看详情 >  │
├─────────────────────────────┤
│ 🏥 紧急联系人               │ 紧急设置
│ 添加联系人 | 医院信息 >     │
├─────────────────────────────┤
│ 🔒 隐私安全                 │ 安全设置
│ 数据权限 | 账号安全 >       │
├─────────────────────────────┤
│ ❓ 帮助中心                 │ 帮助设置
│ 使用教程 | 联系客服 >       │
└─────────────────────────────┘
```

## 4. 组件库设计

### 4.1 数据卡片组件
```jsx
const DataCard = ({ 
  title, 
  value, 
  status, 
  trend, 
  onPress,
  icon 
}) => {
  const getStatusColor = (status) => {
    const colors = {
      normal: '#34C759',
      warning: '#FF9500',
      danger: '#FF3B30'
    };
    return colors[status] || colors.normal;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Icon name={icon} size={24} color="#666" />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardValue, { color: getStatusColor(status) }]}>
          {value}
        </Text>
        {trend && (
          <Text style={styles.cardTrend}>
            {trend > 0 ? '↗️' : '↘️'} {Math.abs(trend)}%
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
```

### 4.2 预警消息组件
```jsx
const AlertMessage = ({ alert, onAction }) => {
  const getAlertIcon = (type) => {
    const icons = {
      emergency: '🚨',
      health: '⚠️',
      device: '🔋',
      reminder: '💊'
    };
    return icons[type] || '📢';
  };

  return (
    <View style={[styles.alertCard, styles[alert.priority]]}>
      <View style={styles.alertHeader}>
        <Text style={styles.alertIcon}>{getAlertIcon(alert.type)}</Text>
        <View style={styles.alertInfo}>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          <Text style={styles.alertTime}>
            {formatTime(alert.timestamp)} | 📍 {alert.location}
          </Text>
        </View>
      </View>
      <View style={styles.alertActions}>
        {alert.actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionButton}
            onPress={() => onAction(action.type, alert)}
          >
            <Text style={styles.actionText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
```

## 5. 状态管理架构

### 5.1 Store结构
```javascript
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    dashboard: dashboardSlice.reducer,
    health: healthSlice.reducer,
    alerts: alertsSlice.reducer,
    services: servicesSlice.reducer,
    settings: settingsSlice.reducer,
    api: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(apiSlice.middleware)
});
```

### 5.2 RTK Query API设计
```javascript
const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Health', 'Alert', 'Service', 'User'],
  endpoints: (builder) => ({
    // 健康数据
    getHealthData: builder.query({
      query: ({ timeRange = '7d' }) => `health/data?range=${timeRange}`,
      providesTags: ['Health']
    }),
    
    // 预警信息
    getAlerts: builder.query({
      query: ({ status = 'all' }) => `alerts?status=${status}`,
      providesTags: ['Alert']
    }),
    
    // 服务预约
    bookService: builder.mutation({
      query: (bookingData) => ({
        url: 'services/book',
        method: 'POST',
        body: bookingData
      }),
      invalidatesTags: ['Service']
    })
  })
});
```

## 6. 推送通知系统

### 6.1 通知类型
```javascript
const NotificationTypes = {
  EMERGENCY: {
    priority: 'high',
    sound: 'emergency.mp3',
    vibration: [0, 250, 250, 250],
    color: '#FF3B30'
  },
  HEALTH_ALERT: {
    priority: 'default',
    sound: 'default',
    vibration: [0, 250],
    color: '#FF9500'
  },
  REMINDER: {
    priority: 'low',
    sound: 'gentle.mp3',
    vibration: [0, 100],
    color: '#007AFF'
  }
};
```

### 6.2 通知处理
```javascript
const handleNotification = (notification) => {
  const { type, data } = notification;
  
  switch (type) {
    case 'emergency':
      // 紧急情况 - 全屏显示
      showEmergencyAlert(data);
      break;
    case 'health_alert':
      // 健康预警 - 横幅通知
      showHealthAlert(data);
      break;
    case 'reminder':
      // 普通提醒 - 状态栏通知
      showReminder(data);
      break;
  }
};
```

## 7. 性能优化策略

### 7.1 数据缓存
- **RTK Query缓存**：自动缓存API响应
- **图片缓存**：React Native Fast Image
- **离线支持**：Redux Persist本地存储

### 7.2 渲染优化
- **列表虚拟化**：FlatList优化长列表
- **图表懒加载**：按需加载图表组件
- **图片优化**：WebP格式，多尺寸适配

## 8. 开发里程碑

### Phase 1: 基础框架（3周）
- [ ] 项目初始化和基础架构
- [ ] 主要页面框架搭建
- [ ] API集成和状态管理
- [ ] 基础组件库开发

### Phase 2: 核心功能（4周）
- [ ] 健康数据可视化
- [ ] 预警系统开发
- [ ] 通信功能集成
- [ ] 服务预约流程

### Phase 3: 优化完善（2周）
- [ ] 推送通知系统
- [ ] 性能优化
- [ ] 用户体验优化
- [ ] 测试和调试

## 9. 投资人演示要点

### 9.1 产品亮点
1. **实时监护**：24小时掌握父母状况
2. **智能预警**：AI分析，提前发现问题
3. **便民服务**：一站式养老服务平台
4. **情感连接**：科技让亲情更近

### 9.2 技术优势
- 现代化技术栈，开发效率高
- 模块化架构，易于维护扩展
- 实时数据同步，响应速度快
- 跨平台支持，用户覆盖广

### 9.3 商业价值
- 解决社会痛点，市场需求大
- 多元化收入模式（服务佣金、会员费）
- 数据价值巨大，可延伸更多服务
- 政策支持，发展前景广阔
