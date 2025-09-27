import React, { useState } from 'react';
import { useGuardianStore } from '../store/useGuardianStore';
import { guardianGrandsonBridge } from '../services/GuardianGrandsonBridge';
import type { Alert } from '../types/index';
import '../styles/global.css';

export const AlertCenterV2: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert, setCurrentScreen } = useGuardianStore();
  const [filterType, setFilterType] = useState<'all' | 'active' | 'resolved'>('active');

  const filteredAlerts = alerts.filter(alert => {
    if (filterType === 'all') return true;
    if (filterType === 'active') return alert.status === 'active' || alert.status === 'acknowledged';
    return alert.status === 'resolved';
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#007AFF';
      default: return '#666';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'health': return '🏥';
      case 'medication': return '💊';
      case 'grandson_concern': return '🤖';
      case 'emergency': return '🚨';
      case 'fall': return '⚠️';
      default: return '🔔';
    }
  };

  const handleAlertAction = (alert: Alert, action: string) => {
    switch (action) {
      case 'video_call':
        console.log('Starting video call...');
        break;
      case 'send_message':
        setCurrentScreen('messages');
        break;
      case 'call_emergency':
        console.log('Calling emergency...');
        break;
      default:
        break;
    }
  };

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="nav-header safe-top">
        <button className="nav-back touch-feedback" onClick={() => setCurrentScreen('dashboard')}>
          <span className="back-icon">‹</span>
        </button>
        <h2 className="nav-title">通知中心</h2>
        <button className="nav-action touch-feedback">
          <span className="action-icon">⚙️</span>
        </button>
      </div>

      {/* Alert Summary */}
      <div className="alert-summary">
        <div className="summary-card urgent">
          <span className="summary-icon">🚨</span>
          <div className="summary-info">
            <span className="summary-count">{alerts.filter(a => a.severity === 'high' && a.status === 'active').length}</span>
            <span className="summary-label">紧急</span>
          </div>
        </div>
        <div className="summary-card attention">
          <span className="summary-icon">⚠️</span>
          <div className="summary-info">
            <span className="summary-count">{alerts.filter(a => a.severity === 'medium' && a.status === 'active').length}</span>
            <span className="summary-label">待处理</span>
          </div>
        </div>
        <div className="summary-card resolved">
          <span className="summary-icon">✅</span>
          <div className="summary-info">
            <span className="summary-count">{alerts.filter(a => a.status === 'resolved').length}</span>
            <span className="summary-label">已解决</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filterType === 'active' ? 'active' : ''}`}
          onClick={() => setFilterType('active')}
        >
          待处理
        </button>
        <button
          className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          全部
        </button>
        <button
          className={`filter-tab ${filterType === 'resolved' ? 'active' : ''}`}
          onClick={() => setFilterType('resolved')}
        >
          已解决
        </button>
      </div>

      {/* Alerts List */}
      <div className="alerts-list">
        {filteredAlerts.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p className="empty-text">暂无通知</p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div key={alert.id} className={`alert-card ${alert.status}`}>
              <div className="alert-header">
                <div className="alert-icon-wrapper">
                  <span className="alert-icon">{getAlertIcon(alert.type)}</span>
                  <span
                    className="severity-dot"
                    style={{ background: getSeverityColor(alert.severity) }}
                  />
                </div>
                <div className="alert-meta">
                  <h3 className="alert-title">{alert.title}</h3>
                  <p className="alert-time">
                    {new Date(alert.timestamp).toLocaleString('zh-CN', {
                      month: 'numeric',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {alert.status === 'active' && (
                  <span className="status-badge active">待处理</span>
                )}
                {alert.status === 'resolved' && (
                  <span className="status-badge resolved">已解决</span>
                )}
              </div>

              <p className="alert-description">{alert.description}</p>

              {alert.grandsonMessage && (
                <div className="grandson-message">
                  <span className="grandson-icon">🤖</span>
                  <p className="grandson-text">{alert.grandsonMessage}</p>
                </div>
              )}

              {alert.status === 'active' && (
                <div className="alert-actions">
                  {alert.suggestedActions?.map((action, idx) => (
                    <button
                      key={idx}
                      className="action-button touch-feedback"
                      onClick={() => handleAlertAction(alert, action.action)}
                    >
                      <span className="action-icon">{action.icon}</span>
                      <span className="action-label">{action.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {alert.status === 'active' && (
                <div className="alert-controls">
                  <button
                    className="control-btn acknowledge"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    知道了
                  </button>
                  <button
                    className="control-btn resolve"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    标记已解决
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .alert-summary {
          display: flex;
          gap: 12px;
          padding: 16px;
        }

        .summary-card {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .summary-card.urgent {
          background: linear-gradient(135deg, #FFE5E5, #FFD0D0);
        }

        .summary-card.attention {
          background: linear-gradient(135deg, #FFF4E5, #FFE8CC);
        }

        .summary-card.resolved {
          background: linear-gradient(135deg, #E5F5E5, #D0F0D0);
        }

        .summary-icon {
          font-size: 24px;
        }

        .summary-info {
          display: flex;
          flex-direction: column;
        }

        .summary-count {
          font-size: 20px;
          font-weight: 700;
          color: #333;
        }

        .summary-label {
          font-size: 12px;
          color: #666;
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
          padding: 0 16px;
          margin-bottom: 16px;
        }

        .filter-tab {
          flex: 1;
          padding: 8px;
          background: #F5F5F5;
          border: 1px solid #E0E0E0;
          border-radius: 8px;
          font-size: 14px;
          color: #666;
          cursor: pointer;
        }

        .filter-tab.active {
          background: #007AFF;
          color: white;
          border-color: #007AFF;
        }

        .alerts-list {
          flex: 1;
          overflow-y: auto;
          padding: 0 16px 32px 16px;
        }

        .empty-state {
          text-align: center;
          padding: 48px 16px;
        }

        .empty-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }

        .empty-text {
          font-size: 16px;
          color: #999;
          margin: 0;
        }

        .alert-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          border-left: 4px solid transparent;
        }

        .alert-card.active {
          border-left-color: #FF9500;
        }

        .alert-card.resolved {
          opacity: 0.7;
          border-left-color: #34C759;
        }

        .alert-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }

        .alert-icon-wrapper {
          position: relative;
        }

        .alert-icon {
          font-size: 28px;
        }

        .severity-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid white;
        }

        .alert-meta {
          flex: 1;
        }

        .alert-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0 0 4px 0;
        }

        .alert-time {
          font-size: 13px;
          color: #999;
          margin: 0;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge.active {
          background: #FFF4E5;
          color: #FF9500;
        }

        .status-badge.resolved {
          background: #E5F5E5;
          color: #34C759;
        }

        .alert-description {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
          margin: 0 0 12px 0;
        }

        .grandson-message {
          display: flex;
          gap: 8px;
          padding: 12px;
          background: linear-gradient(135deg, #E8EAF6, #C5CAE9);
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .grandson-icon {
          font-size: 20px;
        }

        .grandson-text {
          flex: 1;
          font-size: 13px;
          color: #424242;
          margin: 0;
        }

        .alert-actions {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .action-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px;
          background: #F5F5F5;
          border: 1px solid #E0E0E0;
          border-radius: 8px;
          cursor: pointer;
        }

        .action-button:first-child {
          background: #007AFF;
          color: white;
          border-color: #007AFF;
        }

        .action-icon {
          font-size: 18px;
        }

        .action-label {
          font-size: 14px;
          font-weight: 500;
        }

        .alert-controls {
          display: flex;
          gap: 8px;
          padding-top: 12px;
          border-top: 1px solid #F0F0F0;
        }

        .control-btn {
          flex: 1;
          padding: 8px;
          background: none;
          border: 1px solid #E0E0E0;
          border-radius: 8px;
          font-size: 14px;
          color: #666;
          cursor: pointer;
        }

        .control-btn.resolve {
          background: #E8F5E9;
          color: #2E7D32;
          border-color: #C8E6C9;
        }

        .nav-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: white;
          border-bottom: 1px solid #F0F0F0;
        }

        .nav-back {
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .back-icon {
          font-size: 28px;
          color: #333;
        }

        .nav-title {
          flex: 1;
          text-align: center;
          font-size: 18px;
          font-weight: 600;
          color: #1A1A1A;
          margin: 0;
        }

        .nav-action {
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .action-icon {
          font-size: 24px;
          color: #666;
        }
      `}</style>
    </div>
  );
};