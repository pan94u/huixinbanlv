import React, { useEffect } from 'react';
import { useGuardianStore } from '../store/useGuardianStore';
import { guardianGrandsonBridge } from '../services/GuardianGrandsonBridge';

export const Dashboard: React.FC = () => {
  const {
    selectedParent,
    dashboardStats,
    alerts,
    setCurrentScreen
  } = useGuardianStore();

  const grandsonInsights = guardianGrandsonBridge.getGrandsonInsights();
  const emotionalAnalysis = guardianGrandsonBridge.analyzeEmotionalWellbeing();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'offline': return '#9E9E9E';
      case 'sleeping': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return '#4CAF50';
      case 'attention': return '#FF9800';
      case 'warning': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '32px', margin: 0 }}>智伴关爱</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ fontSize: '18px' }}>👤 张小丽</span>
          <button
            style={{
              background: 'white',
              color: '#764ba2',
              border: 'none',
              borderRadius: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            ⚙️ 设置
          </button>
        </div>
      </div>

      {/* Parent Status Card */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '25px',
        marginBottom: '25px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#E3F2FD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px'
            }}>
              👴
            </div>
            <div>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
                {selectedParent?.nickname || '爸爸'} ({selectedParent?.name})
              </h2>
              <div style={{ display: 'flex', gap: '20px', fontSize: '16px' }}>
                <span style={{ color: getStatusColor(selectedParent?.deviceStatus || 'offline') }}>
                  ● {selectedParent?.deviceStatus === 'online' ? '在线' : '离线'}
                </span>
                <span>📍 {selectedParent?.location}</span>
                <span style={{ color: '#666' }}>
                  最后活动：{dashboardStats?.parentStatus.lastActivity
                    ? new Date(dashboardStats.parentStatus.lastActivity).toLocaleTimeString('zh-CN')
                    : '未知'}
                </span>
              </div>
              <div style={{
                marginTop: '10px',
                padding: '10px 15px',
                background: '#FFF3E0',
                borderRadius: '10px',
                fontSize: '16px',
                color: '#E65100'
              }}>
                🤖 小智陪伴：{dashboardStats?.parentStatus.grandsonCompanionTime || 0}分钟 |
                心情：{dashboardStats?.parentStatus.currentMood}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setCurrentScreen('messages')}
              style={{
                padding: '12px 24px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              📞 一键通话
            </button>
            <button
              onClick={() => setCurrentScreen('messages')}
              style={{
                padding: '12px 24px',
                background: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              💌 发送留言
            </button>
          </div>
        </div>
      </div>

      {/* AI Grandson Insights */}
      <div style={{
        background: 'linear-gradient(135deg, #FFF9C4 0%, #FFE082 100%)',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '25px',
        boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '15px'
        }}>
          <span style={{ fontSize: '30px' }}>🤖</span>
          <h3 style={{ margin: 0, fontSize: '20px', color: '#F57C00' }}>
            小智的陪伴报告
          </h3>
        </div>

        {grandsonInsights.map(insight => (
          <div key={insight.id} style={{
            background: 'white',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '10px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <h4 style={{ margin: 0, fontSize: '16px' }}>{insight.title}</h4>
              <span style={{ fontSize: '14px', color: '#666' }}>
                {new Date(insight.timestamp).toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <p style={{ margin: '0 0 10px 0', fontSize: '15px', lineHeight: '1.6' }}>
              {insight.content}
            </p>
            {insight.suggestions && insight.suggestions.length > 0 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {insight.suggestions.map((suggestion, index) => (
                  <span key={index} style={{
                    padding: '4px 10px',
                    background: '#E3F2FD',
                    borderRadius: '15px',
                    fontSize: '14px',
                    color: '#1976D2'
                  }}>
                    💡 {suggestion}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '25px'
      }}>
        <StatCard
          icon="❤️"
          title="健康状态"
          value={dashboardStats?.healthSummary.status === 'normal' ? '正常' : '需关注'}
          color={getHealthStatusColor(dashboardStats?.healthSummary.status || 'normal')}
          onClick={() => setCurrentScreen('health')}
        />
        <StatCard
          icon="🔔"
          title="待处理提醒"
          value={`${alerts.filter(a => a.status === 'active').length} 条`}
          color="#FF9800"
          onClick={() => setCurrentScreen('alerts')}
        />
        <StatCard
          icon="💬"
          title="今日互动"
          value={`${dashboardStats?.todayInteractions.grandsonChats || 0} 次`}
          color="#9C27B0"
        />
        <StatCard
          icon="🏥"
          title="预约服务"
          value="查看"
          color="#00BCD4"
          onClick={() => setCurrentScreen('services')}
        />
      </div>

      {/* Emotional Wellbeing Card */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '25px',
        marginBottom: '25px',
        boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>
          😊 情感状态分析
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '30px'
        }}>
          <div>
            <div style={{
              fontSize: '48px',
              textAlign: 'center',
              marginBottom: '10px'
            }}>
              {emotionalAnalysis.currentState === 'happy' ? '😊' :
               emotionalAnalysis.currentState === 'stable' ? '😌' :
               emotionalAnalysis.currentState === 'lonely' ? '😔' : '😟'}
            </div>
            <div style={{
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              {emotionalAnalysis.currentState === 'happy' ? '开心' :
               emotionalAnalysis.currentState === 'stable' ? '稳定' :
               emotionalAnalysis.currentState === 'lonely' ? '孤独' : '担忧'}
            </div>
            <div style={{
              textAlign: 'center',
              fontSize: '14px',
              color: emotionalAnalysis.trend === 'improving' ? '#4CAF50' :
                     emotionalAnalysis.trend === 'stable' ? '#FF9800' : '#F44336'
            }}>
              趋势：{emotionalAnalysis.trend === 'improving' ? '↗️ 改善中' :
                    emotionalAnalysis.trend === 'stable' ? '→ 稳定' : '↘️ 下降'}
            </div>
          </div>

          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
              小智的观察
            </h4>
            <ul style={{ margin: '0 0 15px 0', paddingLeft: '20px' }}>
              {emotionalAnalysis.grandsonObservations.map((obs, index) => (
                <li key={index} style={{ marginBottom: '5px', fontSize: '14px' }}>
                  {obs}
                </li>
              ))}
            </ul>

            <div style={{
              padding: '10px',
              background: '#E8F5E9',
              borderRadius: '10px',
              fontSize: '14px'
            }}>
              <strong>陪伴质量：</strong> {emotionalAnalysis.companionshipQuality.score}分<br />
              {emotionalAnalysis.companionshipQuality.description}
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#F5F5F5',
          borderRadius: '10px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>建议行动</h4>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {emotionalAnalysis.recommendations.map((rec, index) => (
              <button key={index} style={{
                padding: '8px 15px',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '20px',
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                ✅ {rec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '25px',
          boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: 0, fontSize: '20px' }}>
              🔔 最新提醒
            </h3>
            <button
              onClick={() => setCurrentScreen('alerts')}
              style={{
                background: 'none',
                border: 'none',
                color: '#2196F3',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              查看全部 →
            </button>
          </div>

          {alerts.slice(0, 3).map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  icon: string;
  title: string;
  value: string;
  color: string;
  onClick?: () => void;
}> = ({ icon, title, value, color, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: 'white',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s',
      ':hover': {
        transform: 'scale(1.05)'
      }
    }}
  >
    <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
    <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>{title}</div>
    <div style={{ fontSize: '20px', fontWeight: 'bold', color }}>{value}</div>
  </div>
);

// Alert Card Component
const AlertCard: React.FC<{ alert: any }> = ({ alert }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  return (
    <div style={{
      padding: '15px',
      background: '#FAFAFA',
      borderRadius: '10px',
      marginBottom: '10px',
      borderLeft: `4px solid ${getSeverityColor(alert.severity)}`
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px'
      }}>
        <h4 style={{ margin: 0, fontSize: '16px' }}>{alert.title}</h4>
        <span style={{ fontSize: '12px', color: '#666' }}>
          {new Date(alert.timestamp).toLocaleTimeString('zh-CN')}
        </span>
      </div>
      <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
        {alert.description}
      </p>
      {alert.grandsonMessage && (
        <div style={{
          padding: '8px',
          background: '#FFF9C4',
          borderRadius: '8px',
          fontSize: '14px',
          marginBottom: '10px'
        }}>
          🤖 {alert.grandsonMessage}
        </div>
      )}
      {alert.suggestedActions && (
        <div style={{ display: 'flex', gap: '8px' }}>
          {alert.suggestedActions.map((action: any, index: number) => (
            <button key={index} style={{
              padding: '6px 12px',
              background: '#E3F2FD',
              border: 'none',
              borderRadius: '15px',
              fontSize: '13px',
              cursor: 'pointer',
              color: '#1976D2'
            }}>
              {action.icon} {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};