import React, { useState, useEffect } from 'react';
import { useGuardianStore } from '../store/useGuardianStore';
import { guardianGrandsonBridge } from '../services/GuardianGrandsonBridge';
import '../styles/global.css';

export const DashboardV2: React.FC = () => {
  const {
    selectedParent,
    alerts,
    dashboardStats,
    setCurrentScreen
  } = useGuardianStore();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [grandsonInsights, setGrandsonInsights] = useState<any[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const insights = guardianGrandsonBridge.getGrandsonInsights();
    setGrandsonInsights(insights);
  }, []);

  const unreadAlerts = alerts.filter(a => a.status === 'active').length;

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="dashboard-header safe-top">
        <div className="header-content">
          <div className="greeting-section">
            <h1 className="greeting">
              {currentTime.getHours() < 12 ? '早上好' :
               currentTime.getHours() < 18 ? '下午好' : '晚上好'}
            </h1>
            <p className="subtitle">实时关注父母状况</p>
          </div>
          <button className="notification-btn touch-feedback">
            <span className="notification-icon">🔔</span>
            {unreadAlerts > 0 && <span className="notification-badge">{unreadAlerts}</span>}
          </button>
        </div>
      </div>

      {/* Parent Status Card */}
      <div className="parent-status-card">
        <div className="status-header">
          <div className="parent-info">
            <div className="parent-avatar">
              <span className="avatar-emoji">👴</span>
              <span className="status-indicator online"></span>
            </div>
            <div className="parent-details">
              <h3 className="parent-name">{selectedParent?.name || '张大爷'}</h3>
              <p className="parent-status">
                <span className="status-dot online"></span>
                <span className="status-text">设备在线 · 状态良好</span>
              </p>
            </div>
          </div>
          <button className="video-call-btn touch-feedback">
            <span className="call-icon">📹</span>
          </button>
        </div>

        <div className="ai-companion-status">
          <div className="companion-icon">🤖</div>
          <div className="companion-info">
            <p className="companion-text">小智陪伴中</p>
            <p className="companion-detail">已陪伴交谈 45 分钟</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card touch-feedback">
          <div className="stat-icon health">❤️</div>
          <div className="stat-value">72</div>
          <div className="stat-label">心率</div>
        </div>
        <div className="stat-card touch-feedback">
          <div className="stat-icon steps">👣</div>
          <div className="stat-value">2.8k</div>
          <div className="stat-label">步数</div>
        </div>
        <div className="stat-card touch-feedback">
          <div className="stat-icon sleep">😴</div>
          <div className="stat-value">7.5h</div>
          <div className="stat-label">睡眠</div>
        </div>
        <div className="stat-card touch-feedback">
          <div className="stat-icon medication">💊</div>
          <div className="stat-value">已服</div>
          <div className="stat-label">用药</div>
        </div>
      </div>

      {/* AI Grandson Insights */}
      <div className="insights-section">
        <div className="section-header">
          <h2 className="section-title">小智观察报告</h2>
          <button className="see-all-btn touch-feedback">查看全部</button>
        </div>

        {grandsonInsights.slice(0, 2).map((insight) => (
          <div key={insight.id} className="insight-card">
            <div className="insight-header">
              <span className="insight-icon">
                {insight.type === 'daily_summary' ? '📝' :
                 insight.type === 'health_observation' ? '🏥' :
                 insight.type === 'emotional_state' ? '💭' : '📊'}
              </span>
              <span className="insight-time">
                {new Date(insight.timestamp).toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <h4 className="insight-title">{insight.title}</h4>
            <p className="insight-content">{insight.content}</p>
            {insight.suggestions && insight.suggestions.length > 0 && (
              <div className="insight-suggestions">
                {insight.suggestions.map((suggestion: string, idx: number) => (
                  <button key={idx} className="suggestion-btn touch-feedback">
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Today's Activity Timeline */}
      <div className="timeline-section">
        <h2 className="section-title">今日动态</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <p className="timeline-time">09:30</p>
              <p className="timeline-text">爸爸按时服用降压药</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <p className="timeline-time">10:15</p>
              <p className="timeline-text">小智陪爸爸聊了会儿年轻时的故事</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <p className="timeline-time">14:00</p>
              <p className="timeline-text">午休后血压测量：125/82</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button
          className="action-btn primary touch-feedback"
          onClick={() => setCurrentScreen('health')}
        >
          <span className="action-icon">📊</span>
          <span className="action-label">健康数据</span>
        </button>
        <button
          className="action-btn touch-feedback"
          onClick={() => setCurrentScreen('messages')}
        >
          <span className="action-icon">💬</span>
          <span className="action-label">发送留言</span>
        </button>
        <button
          className="action-btn touch-feedback"
          onClick={() => setCurrentScreen('alerts')}
        >
          <span className="action-icon">🔔</span>
          <span className="action-label">查看提醒</span>
        </button>
      </div>

      <style jsx>{`
        .dashboard-header {
          background: linear-gradient(135deg, #007AFF, #5AC8FA);
          padding: 20px 16px;
          color: white;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .greeting {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .subtitle {
          font-size: 16px;
          opacity: 0.9;
        }

        .notification-btn {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .notification-icon {
          font-size: 24px;
        }

        .notification-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          background: #FF3B30;
          color: white;
          font-size: 11px;
          font-weight: 600;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .parent-status-card {
          margin: 16px;
          padding: 16px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .parent-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .parent-avatar {
          position: relative;
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #FFE0B2, #FFCC80);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-emoji {
          font-size: 28px;
        }

        .status-indicator {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 14px;
          height: 14px;
          border: 3px solid white;
          border-radius: 50%;
        }

        .status-indicator.online {
          background: #34C759;
        }

        .parent-name {
          font-size: 18px;
          font-weight: 600;
          color: #1A1A1A;
          margin: 0 0 4px 0;
        }

        .parent-status {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-dot.online {
          background: #34C759;
        }

        .status-text {
          font-size: 14px;
          color: #666;
        }

        .video-call-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #E3F2FD;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .call-icon {
          font-size: 24px;
        }

        .ai-companion-status {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: linear-gradient(135deg, #E8EAF6, #C5CAE9);
          border-radius: 12px;
        }

        .companion-icon {
          font-size: 32px;
        }

        .companion-text {
          font-size: 14px;
          font-weight: 600;
          color: #424242;
          margin: 0 0 2px 0;
        }

        .companion-detail {
          font-size: 13px;
          color: #666;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin: 0 16px 16px 16px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 16px 8px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .stat-icon {
          font-size: 24px;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 600;
          color: #1A1A1A;
          margin-bottom: 2px;
        }

        .stat-label {
          font-size: 12px;
          color: #999;
        }

        .insights-section {
          margin: 0 16px 16px 16px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1A1A1A;
        }

        .see-all-btn {
          font-size: 14px;
          color: #007AFF;
          background: none;
          border: none;
          cursor: pointer;
        }

        .insight-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .insight-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .insight-icon {
          font-size: 20px;
        }

        .insight-time {
          font-size: 12px;
          color: #999;
        }

        .insight-title {
          font-size: 16px;
          font-weight: 600;
          color: #1A1A1A;
          margin: 0 0 8px 0;
        }

        .insight-content {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
          margin: 0 0 12px 0;
        }

        .insight-suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .suggestion-btn {
          padding: 8px 16px;
          background: #F5F5F5;
          border: 1px solid #E0E0E0;
          border-radius: 20px;
          font-size: 13px;
          color: #424242;
          cursor: pointer;
        }

        .timeline-section {
          margin: 0 16px 16px 16px;
        }

        .timeline {
          position: relative;
          padding-left: 24px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 6px;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background: #E0E0E0;
        }

        .timeline-item {
          position: relative;
          margin-bottom: 20px;
        }

        .timeline-dot {
          position: absolute;
          left: -18px;
          top: 6px;
          width: 12px;
          height: 12px;
          background: #007AFF;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .timeline-content {
          background: white;
          border-radius: 8px;
          padding: 12px;
        }

        .timeline-time {
          font-size: 12px;
          color: #999;
          margin-bottom: 4px;
        }

        .timeline-text {
          font-size: 14px;
          color: #424242;
          margin: 0;
        }

        .quick-actions {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          gap: 12px;
          padding: 16px;
          background: white;
          border-top: 1px solid #F0F0F0;
        }

        .action-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 12px;
          background: #F5F5F5;
          border: none;
          border-radius: 12px;
          cursor: pointer;
        }

        .action-btn.primary {
          background: #007AFF;
          color: white;
        }

        .action-icon {
          font-size: 24px;
        }

        .action-label {
          font-size: 13px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};