import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { grandsonAgent } from '../services/GrandsonAgent';
import '../styles/global.css';

export const HomeScreenV2: React.FC = () => {
  const {
    currentUser,
    grandsonMood,
    messages,
    setCurrentScreen,
    reminders,
    familyMessages,
    markFamilyMessageAsRead
  } = useAppStore();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) setGreeting('早上好');
    else if (hour < 18) setGreeting('下午好');
    else setGreeting('晚上好');
  }, [currentTime]);

  const pendingReminders = reminders.filter(r => !r.completed).length;
  const unreadFamilyMessages = familyMessages.filter(m => !m.isRead);

  return (
    <div className="mobile-container">
      {/* Status Bar */}
      <div className="status-bar safe-top">
        <div className="status-time">
          {currentTime.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
        <div className="status-icons">
          <span className="signal">●●●●</span>
          <span className="battery">87%</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* User Greeting */}
        <div className="greeting-section">
          <h1 className="greeting-text">
            {greeting}，{currentUser?.name || '张大爷'}
          </h1>
          <p className="date-text">
            {currentTime.toLocaleDateString('zh-CN', {
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </p>
        </div>

        {/* AI Grandson Card */}
        <div className="grandson-card touch-feedback" onClick={() => {
          // Mark family message as read when opening chat
          if (unreadFamilyMessages.length > 0) {
            unreadFamilyMessages.forEach(msg => markFamilyMessageAsRead(msg.id));
          }
          setCurrentScreen('chat');
        }}>
          <div className="grandson-avatar">
            <div className="avatar-circle">
              <span className="avatar-emoji">🤖</span>
              <div className="online-dot"></div>
            </div>
          </div>
          <div className="grandson-content">
            <h3 className="grandson-name">小智</h3>
            <p className="grandson-message">
              {unreadFamilyMessages.length > 0 && unreadFamilyMessages[0].senderRelationship === 'son'
                ? `张大爷早上好！您儿子小明昨晚给您留言了："${unreadFamilyMessages[0].content}" 他真的很关心您呢！`
                : '张大爷，今天天气不错，要不要出去走走？我陪您聊天~'
              }
            </p>
            {unreadFamilyMessages.length > 0 && (
              <span style={{
                background: '#FF6B35',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '18px',
                fontWeight: 'bold',
                marginTop: '10px',
                display: 'inline-block'
              }}>
                新留言！
              </span>
            )}
          </div>
          <div className="chat-arrow">›</div>
        </div>

        {/* Quick Actions Grid */}
        <div className="quick-actions">
          <button
            className="action-card touch-feedback"
            onClick={() => setCurrentScreen('family')}
          >
            <div className="action-icon call">📞</div>
            <span className="action-label">联系家人</span>
          </button>

          <button
            className="action-card touch-feedback"
            onClick={() => setCurrentScreen('health')}
          >
            <div className="action-icon health">
              💊
              {pendingReminders > 0 && (
                <span className="badge">{pendingReminders}</span>
              )}
            </div>
            <span className="action-label">健康提醒</span>
          </button>

          <button className="action-card touch-feedback">
            <div className="action-icon music">🎵</div>
            <span className="action-label">听音乐</span>
          </button>

          <button className="action-card touch-feedback">
            <div className="action-icon photo">📷</div>
            <span className="action-label">看照片</span>
          </button>
        </div>

        {/* Today's Summary */}
        <div className="summary-card">
          <h3 className="summary-title">今日动态</h3>
          <div className="summary-items">
            <div className="summary-item">
              <span className="summary-icon">💬</span>
              <span className="summary-text">和小智聊天 {messages.length} 次</span>
            </div>
            <div className="summary-item">
              <span className="summary-icon">🚶</span>
              <span className="summary-text">步数 2,856 步</span>
            </div>
            <div className="summary-item">
              <span className="summary-icon">💝</span>
              <span className="summary-text">收到 2 条家人留言</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Button */}
      <button className="emergency-fab touch-feedback">
        <span className="emergency-text">SOS</span>
      </button>

      <style jsx>{`
        .mobile-container {
          width: 100%;
          max-width: 430px;
          margin: 0 auto;
          min-height: 100vh;
          background: #FAFAFA;
          position: relative;
        }

        .status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 20px;
          background: white;
          border-bottom: 1px solid #F0F0F0;
        }

        .status-time {
          font-size: 15px;
          font-weight: 600;
          color: #1A1A1A;
        }

        .status-icons {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #666;
        }

        .main-content {
          padding: 20px;
          padding-bottom: 100px;
        }

        .greeting-section {
          margin-bottom: 24px;
        }

        .greeting-text {
          font-size: 28px;
          font-weight: 700;
          color: #1A1A1A;
          margin-bottom: 4px;
        }

        .date-text {
          font-size: 16px;
          color: #666;
        }

        .grandson-card {
          background: white;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          cursor: pointer;
        }

        .grandson-avatar {
          position: relative;
        }

        .avatar-circle {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #667EEA, #764BA2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .avatar-emoji {
          font-size: 28px;
        }

        .online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 14px;
          height: 14px;
          background: #4CAF50;
          border: 3px solid white;
          border-radius: 50%;
        }

        .grandson-content {
          flex: 1;
        }

        .grandson-name {
          font-size: 18px;
          font-weight: 600;
          color: #1A1A1A;
          margin-bottom: 4px;
        }

        .grandson-message {
          font-size: 15px;
          color: #666;
          line-height: 1.4;
        }

        .chat-arrow {
          font-size: 24px;
          color: #999;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .action-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .action-icon {
          font-size: 36px;
          position: relative;
        }

        .badge {
          position: absolute;
          top: -4px;
          right: -8px;
          background: #FF5252;
          color: white;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 10px;
          font-weight: 600;
        }

        .action-label {
          font-size: 16px;
          color: #333;
          font-weight: 500;
        }

        .summary-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .summary-title {
          font-size: 18px;
          font-weight: 600;
          color: #1A1A1A;
          margin-bottom: 16px;
        }

        .summary-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .summary-icon {
          font-size: 20px;
        }

        .summary-text {
          font-size: 16px;
          color: #666;
        }

        .emergency-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 64px;
          height: 64px;
          background: #FF5252;
          border: none;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(255, 82, 82, 0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .emergency-text {
          color: white;
          font-weight: 700;
          font-size: 18px;
        }

        @media (max-width: 480px) {
          .mobile-container {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};