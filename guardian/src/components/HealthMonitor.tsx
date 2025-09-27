import React, { useState } from 'react';
import { useGuardianStore } from '../store/useGuardianStore';
import { guardianGrandsonBridge } from '../services/GuardianGrandsonBridge';

export const HealthMonitor: React.FC = () => {
  const { healthHistory, selectedParent, setCurrentScreen } = useGuardianStore();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [selectedMetric, setSelectedMetric] = useState<'bloodPressure' | 'heartRate' | 'steps' | 'sleep'>('bloodPressure');

  // Get latest health data
  const latestData = healthHistory[healthHistory.length - 1];

  // Mock chart data
  const getChartData = () => {
    const days = timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : 30;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      if (selectedMetric === 'bloodPressure') {
        data.push({
          date: date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
          systolic: 120 + Math.random() * 20,
          diastolic: 75 + Math.random() * 15
        });
      } else if (selectedMetric === 'heartRate') {
        data.push({
          date: date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
          value: 65 + Math.random() * 20
        });
      } else if (selectedMetric === 'steps') {
        data.push({
          date: date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
          value: Math.floor(2000 + Math.random() * 3000)
        });
      } else if (selectedMetric === 'sleep') {
        data.push({
          date: date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
          value: 6 + Math.random() * 3
        });
      }
    }
    return data;
  };

  const chartData = getChartData();

  const handleSendHealthReminder = async () => {
    const result = await guardianGrandsonBridge.sendCareInstruction({
      type: 'health_check',
      content: '记得测量血压并按时吃药',
      priority: 'medium',
      gentle: true
    });

    if (result.success) {
      alert(`✅ ${result.grandsonMessage}`);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '30px',
        background: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            onClick={() => setCurrentScreen('dashboard')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ← 返回
          </button>
          <h2 style={{ margin: 0, fontSize: '24px' }}>健康数据中心</h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSendHealthReminder}
            style={{
              padding: '10px 20px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            📋 设置提醒
          </button>
          <button
            style={{
              padding: '10px 20px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            📊 生成报告
          </button>
        </div>
      </div>

      {/* AI Grandson Health Insights */}
      <div style={{
        background: 'linear-gradient(135deg, #FFF9C4 0%, #FFE082 100%)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '25px',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
          <span style={{ fontSize: '28px' }}>🤖</span>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#F57C00' }}>
            小智的健康观察
          </h3>
        </div>
        <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.6' }}>
          {latestData?.grandsonHealthAdvice ||
           '小智今天陪爷爷测量了血压，数值稳定。爷爷按时吃了药，精神状态不错。建议继续保持规律作息，小智会持续关注爷爷的健康状况。'}
        </p>
      </div>

      {/* Health Metrics Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '25px'
      }}>
        <HealthMetricCard
          icon="🩺"
          title="血压"
          value={latestData?.bloodPressure
            ? `${latestData.bloodPressure.systolic}/${latestData.bloodPressure.diastolic}`
            : '130/85'}
          unit="mmHg"
          status="normal"
          trend="stable"
          grandsonNote="小智：血压稳定，很好！"
        />
        <HealthMetricCard
          icon="❤️"
          title="心率"
          value={latestData?.heartRate?.toString() || '72'}
          unit="bpm"
          status="normal"
          trend="stable"
          grandsonNote="小智：心率正常"
        />
        <HealthMetricCard
          icon="🚶"
          title="步数"
          value={latestData?.steps?.toString() || '2,856'}
          unit="步"
          status="normal"
          trend="up"
          grandsonNote="小智：运动量不错！"
        />
        <HealthMetricCard
          icon="😴"
          title="睡眠"
          value={latestData?.sleep?.duration.toString() || '7.5'}
          unit="小时"
          status="normal"
          trend="stable"
          grandsonNote="小智：睡眠充足"
        />
      </div>

      {/* Chart Section */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '25px',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: 0, fontSize: '20px' }}>健康趋势</h3>

          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Time Range Selector */}
            <div style={{ display: 'flex', gap: '5px' }}>
              {(['day', 'week', 'month'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  style={{
                    padding: '8px 15px',
                    background: timeRange === range ? '#4CAF50' : 'white',
                    color: timeRange === range ? 'white' : '#666',
                    border: `1px solid ${timeRange === range ? '#4CAF50' : '#ddd'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {range === 'day' ? '日' : range === 'week' ? '周' : '月'}
                </button>
              ))}
            </div>

            {/* Metric Selector */}
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              style={{
                padding: '8px 15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="bloodPressure">血压</option>
              <option value="heartRate">心率</option>
              <option value="steps">步数</option>
              <option value="sleep">睡眠</option>
            </select>
          </div>
        </div>

        {/* Simple Chart Visualization */}
        <div style={{
          height: '300px',
          position: 'relative',
          padding: '20px',
          background: '#FAFAFA',
          borderRadius: '10px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: '100%'
          }}>
            {chartData.map((data, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    maxWidth: '40px',
                    background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
                    borderRadius: '5px 5px 0 0',
                    height: `${
                      selectedMetric === 'bloodPressure'
                        ? ((data as any).systolic / 200) * 100
                        : selectedMetric === 'steps'
                        ? ((data as any).value / 5000) * 100
                        : selectedMetric === 'sleep'
                        ? ((data as any).value / 12) * 100
                        : ((data as any).value / 100) * 100
                    }%`,
                    transition: 'height 0.3s'
                  }}
                />
                <div style={{
                  marginTop: '10px',
                  fontSize: '12px',
                  color: '#666',
                  textAlign: 'center'
                }}>
                  {(data as any).date}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#E8F5E9',
          borderRadius: '10px',
          fontSize: '14px'
        }}>
          <strong>趋势分析：</strong>
          {selectedMetric === 'bloodPressure' && '最近一周血压保持稳定，继续保持良好生活习惯'}
          {selectedMetric === 'heartRate' && '心率波动在正常范围内，无异常'}
          {selectedMetric === 'steps' && '运动量有所增加，保持良好的运动习惯'}
          {selectedMetric === 'sleep' && '睡眠质量稳定，建议继续保持规律作息'}
        </div>
      </div>

      {/* Medication Reminders */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '25px',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>
          💊 用药管理
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px'
        }}>
          <MedicationCard
            name="降压药"
            dosage="1片/次"
            times={['08:00', '14:00', '20:00']}
            grandsonReminder="小智会温柔地提醒爷爷按时吃药"
            taken={true}
          />
          <MedicationCard
            name="维生素D"
            dosage="1片/天"
            times={['09:00']}
            grandsonReminder="小智会在早餐后提醒"
            taken={false}
          />
        </div>

        <button
          style={{
            marginTop: '20px',
            width: '100%',
            padding: '15px',
            background: '#E3F2FD',
            border: '1px solid #2196F3',
            borderRadius: '10px',
            color: '#1976D2',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          ➕ 添加新的用药提醒
        </button>
      </div>
    </div>
  );
};

// Health Metric Card Component
const HealthMetricCard: React.FC<{
  icon: string;
  title: string;
  value: string;
  unit: string;
  status: 'normal' | 'attention' | 'warning';
  trend: 'up' | 'down' | 'stable';
  grandsonNote?: string;
}> = ({ icon, title, value, unit, status, trend, grandsonNote }) => {
  const statusColors = {
    normal: '#4CAF50',
    attention: '#FF9800',
    warning: '#F44336'
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
      <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>{title}</div>
      <div style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: statusColors[status],
        marginBottom: '5px'
      }}>
        {value} <span style={{ fontSize: '16px', color: '#999' }}>{unit}</span>
      </div>
      <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
        {trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '→'} 趋势{
          trend === 'up' ? '上升' : trend === 'down' ? '下降' : '稳定'
        }
      </div>
      {grandsonNote && (
        <div style={{
          padding: '8px',
          background: '#FFF9C4',
          borderRadius: '8px',
          fontSize: '12px'
        }}>
          {grandsonNote}
        </div>
      )}
    </div>
  );
};

// Medication Card Component
const MedicationCard: React.FC<{
  name: string;
  dosage: string;
  times: string[];
  grandsonReminder: string;
  taken: boolean;
}> = ({ name, dosage, times, grandsonReminder, taken }) => (
  <div style={{
    padding: '15px',
    background: taken ? '#E8F5E9' : '#FFF3E0',
    borderRadius: '10px',
    border: `1px solid ${taken ? '#4CAF50' : '#FF9800'}`
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px'
    }}>
      <h4 style={{ margin: 0, fontSize: '16px' }}>{name}</h4>
      <span style={{
        padding: '4px 8px',
        background: taken ? '#4CAF50' : '#FF9800',
        color: 'white',
        borderRadius: '12px',
        fontSize: '12px'
      }}>
        {taken ? '✅ 已服用' : '⏰ 待服用'}
      </span>
    </div>
    <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
      剂量：{dosage}
    </div>
    <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
      时间：{times.join('、')}
    </div>
    <div style={{
      padding: '8px',
      background: 'white',
      borderRadius: '6px',
      fontSize: '13px',
      color: '#666',
      fontStyle: 'italic'
    }}>
      🤖 {grandsonReminder}
    </div>
  </div>
);