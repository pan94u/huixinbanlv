import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import '../styles/global.css';

export const FamilyScreen: React.FC = () => {
  const { currentUser, setCurrentScreen } = useAppStore();
  const [activeTab, setActiveTab] = useState<'contacts' | 'messages'>('contacts');

  const familyMembers = [
    {
      id: '1',
      name: '张小丽',
      relationship: 'daughter',
      avatar: '👩',
      phone: '138****1234',
      lastContact: '2小时前',
      status: 'online'
    },
    {
      id: '2',
      name: '张小明',
      relationship: 'son',
      avatar: '👨',
      phone: '139****5678',
      lastContact: '昨天',
      status: 'offline'
    },
    {
      id: '3',
      name: '小宝',
      relationship: 'grandson',
      avatar: '👦',
      phone: '137****9012',
      lastContact: '3天前',
      status: 'offline'
    }
  ];

  const messages = [
    {
      id: '1',
      sender: '张小丽',
      avatar: '👩',
      content: '爸爸，天冷了记得多穿衣服，我周末回来看您！',
      time: '14:30',
      date: '今天'
    },
    {
      id: '2',
      sender: '张小明',
      avatar: '👨',
      content: '爸，我给您买了新的血压计，明天快递就到了。',
      time: '20:15',
      date: '昨天'
    }
  ];

  const getRelationshipText = (relationship: string) => {
    const map: Record<string, string> = {
      son: '儿子',
      daughter: '女儿',
      grandson: '孙子',
      granddaughter: '孙女'
    };
    return map[relationship] || '家人';
  };

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="family-header safe-top">
        <button className="nav-back touch-feedback" onClick={() => setCurrentScreen('home')}>
          <span className="back-icon">‹</span>
        </button>
        <h2 className="header-title">家人联系</h2>
        <button className="header-action touch-feedback">
          <span className="action-icon">+</span>
        </button>
      </div>

      {/* AI Grandson Helper Card */}
      <div className="grandson-helper-card">
        <div className="helper-avatar">
          <span>🤖</span>
        </div>
        <div className="helper-message">
          <p className="helper-text">小智可以帮您联系家人，点击下方按钮即可拨打电话或视频通话</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav">
        <button
          className={`tab-item ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          <span className="tab-icon">👥</span>
          <span className="tab-label">家人列表</span>
        </button>
        <button
          className={`tab-item ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <span className="tab-icon">💌</span>
          <span className="tab-label">留言</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'contacts' && (
          <div className="contacts-list">
            {familyMembers.map(member => (
              <div key={member.id} className="contact-card touch-feedback">
                <div className="contact-avatar">
                  <span className="avatar-emoji">{member.avatar}</span>
                  {member.status === 'online' && <span className="status-dot"></span>}
                </div>
                <div className="contact-info">
                  <h3 className="contact-name">{member.name}</h3>
                  <p className="contact-relationship">{getRelationshipText(member.relationship)}</p>
                  <p className="contact-last-contact">上次通话: {member.lastContact}</p>
                </div>
                <div className="contact-actions">
                  <button className="action-btn call touch-feedback">
                    <span className="btn-icon">📞</span>
                  </button>
                  <button className="action-btn video touch-feedback">
                    <span className="btn-icon">📹</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="messages-list">
            {messages.map(message => (
              <div key={message.id} className="message-card touch-feedback">
                <div className="message-header">
                  <div className="message-sender">
                    <span className="sender-avatar">{message.avatar}</span>
                    <span className="sender-name">{message.sender}</span>
                  </div>
                  <div className="message-time">
                    <span className="time-date">{message.date}</span>
                    <span className="time-clock">{message.time}</span>
                  </div>
                </div>
                <p className="message-content">{message.content}</p>
                <div className="message-actions">
                  <button className="reply-btn touch-feedback">
                    <span className="reply-icon">↩</span>
                    <span className="reply-text">回复</span>
                  </button>
                  <button className="play-btn touch-feedback">
                    <span className="play-icon">🔊</span>
                    <span className="play-text">播放</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Call Bar */}
      <div className="quick-call-bar safe-bottom">
        <button className="quick-btn touch-feedback">
          <span className="quick-icon">🆘</span>
          <span className="quick-label">紧急联系</span>
        </button>
        <button className="quick-btn primary touch-feedback">
          <span className="quick-icon">📞</span>
          <span className="quick-label">一键呼叫女儿</span>
        </button>
      </div>

      <style jsx>{`
        .family-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: white;
          border-bottom: 1px solid #F0F0F0;
        }

        .grandson-helper-card {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 16px;
          padding: 16px;
          background: linear-gradient(135deg, #E8EAF6, #C5CAE9);
          border-radius: 12px;
        }

        .helper-avatar {
          width: 48px;
          height: 48px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .helper-message {
          flex: 1;
        }

        .helper-text {
          margin: 0;
          font-size: 14px;
          color: #424242;
          line-height: 1.4;
        }

        .contacts-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .contact-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .contact-avatar {
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

        .status-dot {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 14px;
          height: 14px;
          background: #4CAF50;
          border: 3px solid white;
          border-radius: 50%;
        }

        .contact-info {
          flex: 1;
        }

        .contact-name {
          font-size: 17px;
          font-weight: 600;
          color: #1A1A1A;
          margin: 0 0 4px 0;
        }

        .contact-relationship {
          font-size: 14px;
          color: #666;
          margin: 0 0 4px 0;
        }

        .contact-last-contact {
          font-size: 13px;
          color: #999;
          margin: 0;
        }

        .contact-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .action-btn.call {
          background: #E8F5E9;
        }

        .action-btn.video {
          background: #E3F2FD;
        }

        .btn-icon {
          font-size: 24px;
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .message-sender {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sender-avatar {
          font-size: 24px;
        }

        .sender-name {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .message-time {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .time-date {
          font-size: 12px;
          color: #999;
        }

        .time-clock {
          font-size: 13px;
          color: #666;
        }

        .message-content {
          font-size: 15px;
          color: #424242;
          line-height: 1.5;
          margin: 0 0 12px 0;
        }

        .message-actions {
          display: flex;
          gap: 12px;
        }

        .reply-btn, .play-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #F5F5F5;
          border: none;
          border-radius: 20px;
          font-size: 14px;
          color: #666;
          cursor: pointer;
        }

        .reply-icon, .play-icon {
          font-size: 16px;
        }

        .quick-call-bar {
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

        .quick-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          background: #FFF3E0;
          border: none;
          border-radius: 12px;
          cursor: pointer;
        }

        .quick-btn.primary {
          background: #4CAF50;
          color: white;
        }

        .quick-icon {
          font-size: 20px;
        }

        .quick-label {
          font-size: 15px;
          font-weight: 500;
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
          border-radius: 50%;
        }

        .back-icon {
          font-size: 28px;
          color: #333;
        }

        .header-title {
          flex: 1;
          text-align: center;
          font-size: 18px;
          font-weight: 600;
          color: #1A1A1A;
          margin: 0;
        }

        .header-action {
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

        .tab-nav {
          display: flex;
          background: white;
          border-bottom: 1px solid #F0F0F0;
        }

        .tab-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 12px;
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
        }

        .tab-item.active {
          color: #007AFF;
        }

        .tab-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #007AFF;
        }

        .tab-icon {
          font-size: 20px;
        }

        .tab-label {
          font-size: 13px;
          color: inherit;
        }

        .tab-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          padding-bottom: 100px;
        }
      `}</style>
    </div>
  );
};