import React, { useState } from 'react';
import { useGuardianStore } from '../store/useGuardianStore';
import { guardianGrandsonBridge } from '../services/GuardianGrandsonBridge';
import '../styles/global.css';

export const MessageCenterV2: React.FC = () => {
  const {
    selectedParent,
    messages,
    sendMessage,
    setCurrentScreen
  } = useGuardianStore();

  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState<'text' | 'voice'>('text');
  const [showQuickMessages, setShowQuickMessages] = useState(true);

  const quickMessages = [
    '爸爸，记得按时吃药',
    '天冷了，多穿点衣服',
    '我周末回来看您',
    '有什么需要告诉我'
  ];

  const handleSendMessage = async (text: string = messageText) => {
    if (!text.trim()) return;

    // Send message through store
    sendMessage({
      content: text,
      sender: 'guardian',
      receiver: selectedParent?.id || '',
      type: 'text'
    });

    // Send care instruction through AI grandson
    const instruction = {
      type: 'emotional_support' as const,
      content: text,
      priority: 'medium' as const,
      gentle: true
    };

    const result = await guardianGrandsonBridge.sendCareInstruction(instruction);
    console.log('Message delivery:', result);

    setMessageText('');
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="nav-header safe-top">
        <button className="nav-back touch-feedback" onClick={() => setCurrentScreen('dashboard')}>
          <span className="back-icon">‹</span>
        </button>
        <h2 className="nav-title">留言中心</h2>
        <button className="nav-action touch-feedback">
          <span className="action-icon">📞</span>
        </button>
      </div>

      {/* Parent Info */}
      <div className="chat-info">
        <div className="chat-avatar">
          <span className="avatar-emoji">👴</span>
          <span className="online-dot"></span>
        </div>
        <div className="chat-details">
          <h3 className="chat-name">{selectedParent?.name || '张大爷'}</h3>
          <p className="chat-status">
            <span className="status-icon">🤖</span>
            小智会将留言温柔地转达
          </p>
        </div>
      </div>

      {/* Messages List */}
      <div className="messages-container hide-scrollbar">
        <div className="date-divider">
          <span className="date-text">今天</span>
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-bubble ${message.sender === 'guardian' ? 'sent' : 'received'}`}
          >
            {message.sender !== 'guardian' && (
              <div className="message-avatar">
                <span>👴</span>
              </div>
            )}
            <div className="bubble-content">
              <p className="message-text">{message.content}</p>
              <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
            {message.sender === 'guardian' && message.read && (
              <span className="read-receipt">已读</span>
            )}
          </div>
        ))}

        {/* AI Grandson Delivery Status */}
        <div className="delivery-status">
          <div className="delivery-icon">🤖</div>
          <div className="delivery-info">
            <p className="delivery-text">小智已将您的留言转达给爸爸</p>
            <p className="delivery-detail">爸爸听了很开心，说谢谢女儿的关心</p>
          </div>
        </div>
      </div>

      {/* Quick Messages */}
      {showQuickMessages && (
        <div className="quick-messages">
          <p className="quick-title">快捷留言</p>
          <div className="quick-chips">
            {quickMessages.map((msg, idx) => (
              <button
                key={idx}
                className="quick-chip touch-feedback"
                onClick={() => handleSendMessage(msg)}
              >
                {msg}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="input-area safe-bottom">
        <div className="input-toolbar">
          <button
            className={`toolbar-btn ${messageType === 'voice' ? 'active' : ''}`}
            onClick={() => setMessageType(messageType === 'voice' ? 'text' : 'voice')}
          >
            <span className="toolbar-icon">🎤</span>
          </button>
          <button className="toolbar-btn">
            <span className="toolbar-icon">📷</span>
          </button>
          <button className="toolbar-btn">
            <span className="toolbar-icon">❤️</span>
          </button>
        </div>

        <div className="input-row">
          {messageType === 'text' ? (
            <>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="输入留言..."
                className="message-input"
              />
              <button
                className="send-btn touch-feedback"
                onClick={() => handleSendMessage()}
                disabled={!messageText.trim()}
              >
                <span className="send-icon">➤</span>
              </button>
            </>
          ) : (
            <button className="voice-record-btn touch-feedback">
              <span className="voice-icon">🎤</span>
              <span className="voice-text">按住说话</span>
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .chat-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: white;
          border-bottom: 1px solid #F0F0F0;
        }

        .chat-avatar {
          position: relative;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #FFE0B2, #FFCC80);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-emoji {
          font-size: 24px;
        }

        .online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #34C759;
          border: 3px solid white;
          border-radius: 50%;
        }

        .chat-details {
          flex: 1;
        }

        .chat-name {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0 0 4px 0;
        }

        .chat-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #666;
          margin: 0;
        }

        .status-icon {
          font-size: 14px;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #F8F9FA;
        }

        .date-divider {
          text-align: center;
          margin: 16px 0;
        }

        .date-text {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          font-size: 12px;
          color: #666;
        }

        .message-bubble {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          margin-bottom: 16px;
        }

        .message-bubble.sent {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #FFE0B2, #FFCC80);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .bubble-content {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 18px;
          background: white;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
        }

        .message-bubble.sent .bubble-content {
          background: #007AFF;
          color: white;
        }

        .message-text {
          font-size: 15px;
          line-height: 1.4;
          margin: 0 0 4px 0;
        }

        .message-time {
          font-size: 11px;
          opacity: 0.7;
        }

        .read-receipt {
          font-size: 11px;
          color: #007AFF;
          margin-right: 4px;
        }

        .delivery-status {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: linear-gradient(135deg, #E8EAF6, #C5CAE9);
          border-radius: 12px;
          margin: 16px 0;
        }

        .delivery-icon {
          font-size: 24px;
        }

        .delivery-text {
          font-size: 13px;
          font-weight: 500;
          color: #424242;
          margin: 0 0 4px 0;
        }

        .delivery-detail {
          font-size: 12px;
          color: #666;
          margin: 0;
        }

        .quick-messages {
          padding: 12px 16px;
          background: white;
          border-top: 1px solid #F0F0F0;
        }

        .quick-title {
          font-size: 12px;
          color: #999;
          margin: 0 0 8px 0;
        }

        .quick-chips {
          display: flex;
          gap: 8px;
          overflow-x: auto;
        }

        .quick-chip {
          padding: 8px 16px;
          background: #F5F5F5;
          border: 1px solid #E0E0E0;
          border-radius: 20px;
          font-size: 14px;
          color: #333;
          white-space: nowrap;
          cursor: pointer;
        }

        .input-area {
          background: white;
          border-top: 1px solid #F0F0F0;
          padding: 12px 16px;
        }

        .input-toolbar {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .toolbar-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: #F5F5F5;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .toolbar-btn.active {
          background: #007AFF;
        }

        .toolbar-icon {
          font-size: 18px;
        }

        .input-row {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .message-input {
          flex: 1;
          padding: 10px 16px;
          background: #F5F5F5;
          border: none;
          border-radius: 24px;
          font-size: 15px;
          outline: none;
        }

        .send-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #007AFF;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .send-btn:disabled {
          background: #E0E0E0;
          cursor: not-allowed;
        }

        .send-icon {
          font-size: 20px;
        }

        .voice-record-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 12px;
          background: linear-gradient(135deg, #007AFF, #5AC8FA);
          color: white;
          border: none;
          border-radius: 24px;
          cursor: pointer;
        }

        .voice-icon {
          font-size: 24px;
        }

        .voice-text {
          font-size: 16px;
          font-weight: 500;
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
        }
      `}</style>
    </div>
  );
};