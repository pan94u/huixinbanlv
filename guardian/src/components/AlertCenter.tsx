import React from 'react';
import { useGuardianStore } from '../store/useGuardianStore';
import { guardianGrandsonBridge } from '../services/GuardianGrandsonBridge';

export const AlertCenter: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert, setCurrentScreen } = useGuardianStore();

  const handleEmergencyResponse = (alert: any) => {
    const coordination = guardianGrandsonBridge.handleEmergencyWithGrandson(alert);

    // Show emergency coordination dialog
    const message = `
紧急情况处理中：

🤖 小智状态：${coordination.grandsonStatus}

小智正在：
${coordination.grandsonActions.join('\n')}

爷爷状况：${coordination.elderlyCondition}

建议您：
${coordination.suggestedGuardianActions.map(a => `${a.urgent ? '🚨' : '📌'} ${a.label}`).join('\n')}
    `;

    alert(message);
    acknowledgeAlert(alert.id);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return '🚨';
      case 'health': return '🏥';
      case 'activity': return '🚶';
      case 'device': return '📱';
      case 'grandson_concern': return '🤖';
      default: return '🔔';
    }
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const acknowledgedAlerts = alerts.filter(a => a.status === 'acknowledged');
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFE0B2 0%, #FFCCBC 100%)',
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
          <h2 style={{ margin: 0, fontSize: '24px' }}>智能预警中心</h2>
        </div>

        <div style={{
          display: 'flex',
          gap: '20px',
          fontSize: '16px'
        }}>
          <span style={{ color: '#F44336' }}>
            🔴 紧急: {activeAlerts.filter(a => a.severity === 'high').length}
          </span>
          <span style={{ color: '#FF9800' }}>
            🟡 重要: {activeAlerts.filter(a => a.severity === 'medium').length}
          </span>
          <span style={{ color: '#4CAF50' }}>
            🟢 一般: {activeAlerts.filter(a => a.severity === 'low').length}
          </span>
        </div>
      </div>

      {/* AI Grandson Alert Summary */}
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
            小智实时守护报告
          </h3>
        </div>
        <p style={{ margin: 0, fontSize: '16px', lineHeight: '1.6' }}>
          小智24小时陪伴爷爷，目前一切正常。今天已主动关怀3次，发现爷爷心情不错。
          如有任何异常，小智会第一时间通知您。当前爷爷正在休息，小智保持静默守护模式。
        </p>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '25px',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '20px',
            color: '#F44336'
          }}>
            🔴 待处理提醒 ({activeAlerts.length})
          </h3>

          {activeAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={() => acknowledgeAlert(alert.id)}
              onResolve={() => resolveAlert(alert.id)}
              onEmergency={() => handleEmergencyResponse(alert)}
            />
          ))}
        </div>
      )}

      {/* Acknowledged Alerts */}
      {acknowledgedAlerts.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          marginBottom: '25px',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '20px',
            color: '#FF9800'
          }}>
            🟡 处理中 ({acknowledgedAlerts.length})
          </h3>

          {acknowledgedAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onResolve={() => resolveAlert(alert.id)}
              isAcknowledged
            />
          ))}
        </div>
      )}

      {/* Resolved Alerts */}
      {resolvedAlerts.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
          opacity: 0.8
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '20px',
            color: '#4CAF50'
          }}>
            🟢 已解决 ({resolvedAlerts.length})
          </h3>

          {resolvedAlerts.slice(0, 3).map(alert => (
            <div key={alert.id} style={{
              padding: '15px',
              background: '#F5F5F5',
              borderRadius: '10px',
              marginBottom: '10px',
              opacity: 0.7
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{getTypeIcon(alert.type)} {alert.title}</span>
                <span style={{ fontSize: '12px', color: '#666' }}>
                  {new Date(alert.timestamp).toLocaleString('zh-CN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Alert Card Component
const AlertCard: React.FC<{
  alert: any;
  onAcknowledge?: () => void;
  onResolve?: () => void;
  onEmergency?: () => void;
  isAcknowledged?: boolean;
}> = ({ alert, onAcknowledge, onResolve, onEmergency, isAcknowledged }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return '🚨';
      case 'health': return '🏥';
      case 'activity': return '🚶';
      case 'device': return '📱';
      case 'grandson_concern': return '🤖';
      default: return '🔔';
    }
  };

  return (
    <div style={{
      padding: '20px',
      background: isAcknowledged ? '#FFF3E0' : '#FFEBEE',
      borderRadius: '10px',
      marginBottom: '15px',
      borderLeft: `5px solid ${getSeverityColor(alert.severity)}`
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '15px'
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '24px' }}>{getTypeIcon(alert.type)}</span>
            <h4 style={{ margin: 0, fontSize: '18px' }}>{alert.title}</h4>
            <span style={{
              padding: '4px 8px',
              background: getSeverityColor(alert.severity),
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              {alert.severity === 'high' ? '紧急' :
               alert.severity === 'medium' ? '重要' : '一般'}
            </span>
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
            {alert.description}
          </p>
        </div>

        <div style={{ fontSize: '12px', color: '#666', textAlign: 'right' }}>
          {new Date(alert.timestamp).toLocaleString('zh-CN')}
        </div>
      </div>

      {alert.grandsonMessage && (
        <div style={{
          padding: '12px',
          background: 'linear-gradient(135deg, #FFF9C4 0%, #FFE082 100%)',
          borderRadius: '8px',
          marginBottom: '15px',
          fontSize: '14px'
        }}>
          <strong>🤖 小智观察：</strong> {alert.grandsonMessage}
        </div>
      )}

      {alert.suggestedActions && alert.suggestedActions.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontSize: '14px', marginBottom: '8px', fontWeight: 'bold' }}>
            建议操作：
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {alert.suggestedActions.map((action: any, index: number) => (
              <button
                key={index}
                onClick={() => {
                  if (action.action === 'video_call') {
                    console.log('Starting video call...');
                  } else if (action.action === 'send_message') {
                    console.log('Opening message center...');
                  }
                }}
                style={{
                  padding: '8px 15px',
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '20px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                {action.icon} {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        {alert.severity === 'high' && !isAcknowledged && onEmergency && (
          <button
            onClick={onEmergency}
            style={{
              padding: '10px 20px',
              background: '#F44336',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🚨 紧急处理
          </button>
        )}

        {!isAcknowledged && onAcknowledge && (
          <button
            onClick={onAcknowledge}
            style={{
              padding: '10px 20px',
              background: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            ✋ 标记已读
          </button>
        )}

        {onResolve && (
          <button
            onClick={onResolve}
            style={{
              padding: '10px 20px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            ✅ 标记解决
          </button>
        )}
      </div>
    </div>
  );
};