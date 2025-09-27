import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { grandsonAgent } from '../services/GrandsonAgent';
import type { AIGrandsonMessage } from '../types/index';
import '../styles/global.css';

export const ChatScreen: React.FC = () => {
  const { messages, addMessage, setCurrentScreen } = useAppStore();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showQuickReplies] = useState(true);

  const quickReplies = [
    '今天天气怎么样？',
    '我想听个故事',
    '陪我聊聊天',
    '播放音乐'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const greeting = grandsonAgent.getGreeting();
      addMessage(greeting);
    }
  }, []);

  const handleSend = async (text: string = inputText) => {
    if (!text.trim()) return;

    const userMessage: AIGrandsonMessage = {
      id: Date.now().toString(),
      type: 'chat',
      content: text,
      timestamp: new Date(),
      isFromGrandson: false
    };
    addMessage(userMessage);
    setInputText('');
    setIsTyping(true);

    setTimeout(async () => {
      const response = await grandsonAgent.processUserInput(text);
      addMessage(response);
      setIsTyping(false);
    }, 800 + Math.random() * 400);
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'call_family':
        setCurrentScreen('family');
        break;
      case 'view_health':
        setCurrentScreen('health');
        break;
      default:
        break;
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mobile-container">
      {/* Chat Header */}
      <div className="chat-header safe-top">
        <button className="nav-back touch-feedback" onClick={() => setCurrentScreen('home')}>
          <span className="back-icon">‹</span>
        </button>
        <div className="chat-user-info">
          <div className="chat-avatar-small">
            <span className="avatar-emoji">🤖</span>
            <span className="online-indicator"></span>
          </div>
          <div className="chat-user-details">
            <h3 className="chat-username">小智</h3>
            <p className="chat-status">在线陪伴中</p>
          </div>
        </div>
        <button className="chat-menu touch-feedback">
          <span className="menu-dots">⋯</span>
        </button>
      </div>

      {/* Messages Area */}
      <div className="chat-messages hide-scrollbar">
        <div className="chat-date-divider">
          <span className="date-text">今天</span>
        </div>

        {messages.map((message, index) => (
          <div key={message.id} className="message-wrapper">
            {index === 0 ||
             new Date(messages[index - 1].timestamp).getHours() !== new Date(message.timestamp).getHours() ? (
              <div className="time-stamp">{formatTime(message.timestamp)}</div>
            ) : null}

            <div className={`message-row ${message.isFromGrandson ? 'grandson' : 'user'}`}>
              {message.isFromGrandson && (
                <div className="message-avatar">
                  <span>🤖</span>
                </div>
              )}
              <div className="message-content">
                <div className="message-bubble">
                  <p className="message-text">{message.content}</p>
                </div>
                {message.actions && message.actions.length > 0 && (
                  <div className="suggested-actions">
                    {message.actions.map((action, idx) => (
                      <button
                        key={idx}
                        className="action-chip touch-feedback"
                        onClick={() => handleAction(action.action)}
                      >
                        <span className="action-icon">{action.icon}</span>
                        <span className="action-text">{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message-row grandson">
            <div className="message-avatar">
              <span>🤖</span>
            </div>
            <div className="message-content">
              <div className="typing-bubble">
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {showQuickReplies && messages.length < 3 && (
        <div className="quick-replies">
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              className="quick-reply-chip touch-feedback"
              onClick={() => handleSend(reply)}
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="chat-input-container safe-bottom">
        <button className="input-addon touch-feedback">
          <span className="addon-icon">+</span>
        </button>
        <div className="input-wrapper">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="说点什么..."
            className="chat-input"
          />
        </div>
        <button
          className="send-btn touch-feedback"
          onClick={() => handleSend()}
          disabled={!inputText.trim()}
        >
          <span className="send-icon">➤</span>
        </button>
      </div>

      <style jsx>{`
        .chat-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: white;
          border-bottom: 1px solid #F0F0F0;
          gap: 12px;
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

        .chat-user-info {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-avatar-small {
          position: relative;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667EEA, #764BA2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-emoji {
          font-size: 20px;
        }

        .online-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          background: #4CAF50;
          border: 2px solid white;
          border-radius: 50%;
        }

        .chat-user-details {
          flex: 1;
        }

        .chat-username {
          font-size: 17px;
          font-weight: 600;
          color: #1A1A1A;
          margin: 0;
        }

        .chat-status {
          font-size: 13px;
          color: #4CAF50;
          margin: 0;
        }

        .chat-menu {
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .menu-dots {
          font-size: 24px;
          color: #666;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #F8F8F8;
          min-height: 0;
        }

        .chat-date-divider {
          text-align: center;
          margin: 16px 0;
        }

        .date-text {
          background: rgba(0, 0, 0, 0.05);
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 13px;
          color: #666;
        }

        .message-wrapper {
          margin-bottom: 16px;
        }

        .time-stamp {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin: 8px 0;
        }

        .message-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
        }

        .message-row.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #667EEA, #764BA2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .message-content {
          max-width: 75%;
        }

        .message-bubble {
          padding: 12px 16px;
          border-radius: 18px;
          background: white;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
        }

        .message-row.user .message-bubble {
          background: #007AFF;
          color: white;
        }

        .message-text {
          margin: 0;
          font-size: 16px;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .suggested-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .action-chip {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 14px;
          background: white;
          border: 1px solid #E0E0E0;
          border-radius: 20px;
          font-size: 14px;
          color: #333;
          cursor: pointer;
        }

        .action-icon {
          font-size: 16px;
        }

        .typing-bubble {
          padding: 12px 20px;
          background: white;
          border-radius: 18px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
        }

        .typing-dots {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .typing-dots span {
          width: 8px;
          height: 8px;
          background: #999;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .quick-replies {
          padding: 8px 16px;
          background: white;
          border-top: 1px solid #F0F0F0;
          display: flex;
          gap: 8px;
          overflow-x: auto;
        }

        .quick-reply-chip {
          padding: 8px 16px;
          background: #F5F5F5;
          border: 1px solid #E0E0E0;
          border-radius: 20px;
          font-size: 14px;
          color: #333;
          white-space: nowrap;
          cursor: pointer;
        }

        .chat-input-container {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: white;
          border-top: 1px solid #F0F0F0;
          gap: 12px;
        }

        .input-addon {
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

        .addon-icon {
          font-size: 20px;
          color: #666;
        }

        .input-wrapper {
          flex: 1;
        }

        .chat-input {
          width: 100%;
          padding: 10px 16px;
          background: #F5F5F5;
          border: none;
          border-radius: 24px;
          font-size: 16px;
          outline: none;
        }

        .send-btn {
          width: 36px;
          height: 36px;
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
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};