import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { grandsonAgent } from '../services/GrandsonAgent';
import type { AIGrandsonMessage } from '../types/index';
import './ChatScreen.css';

export const ChatScreen: React.FC = () => {
  const {
    messages,
    addMessage,
    setCurrentScreen,
    familyMessages,
    markFamilyMessageAsRead,
    isListening,
    setIsListening
  } = useAppStore();

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout>();

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 初始化消息 - 包含儿子留言提醒
  useEffect(() => {
    if (messages.length === 0) {
      const unreadFamilyMessages = familyMessages.filter(m => !m.isRead);

      if (unreadFamilyMessages.length > 0) {
        const familyMsg = unreadFamilyMessages[0];

        // 系统提示消息
        addMessage({
          id: 'sys-' + Date.now(),
          type: 'system',
          content: '早上 6:30',
          timestamp: new Date(),
          isFromGrandson: false
        } as AIGrandsonMessage);

        // 小智的问候消息
        setTimeout(() => {
          addMessage({
            id: Date.now().toString(),
            type: 'family',
            content: `张大爷早上好！您儿子${familyMsg.sender}昨晚给您留了言："${familyMsg.content}" 他周末会回来看您呢！`,
            emotion: 'caring',
            timestamp: new Date(),
            isFromGrandson: true
          });
          markFamilyMessageAsRead(familyMsg.id);
        }, 500);

        // 关怀提醒
        setTimeout(() => {
          addMessage({
            id: (Date.now() + 1).toString(),
            type: 'care',
            content: '今天降温了，记得多穿点衣服。需要我提醒您吃药吗？',
            emotion: 'caring',
            timestamp: new Date(),
            isFromGrandson: true
          });
        }, 2000);
      }
    }
  }, []);

  // 开始录音
  const startRecording = () => {
    setIsListening(true);
    setRecordingTime(0);

    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    // 模拟录音结束
    setTimeout(() => {
      stopRecording();
      const phrases = [
        '天气怎么样',
        '给儿子打电话',
        '我要吃药了',
        '播放音乐'
      ];
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      handleSend(phrase, 'voice');
    }, 3000);
  };

  // 停止录音
  const stopRecording = () => {
    setIsListening(false);
    setRecordingTime(0);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  };

  // 发送消息
  const handleSend = (text: string = inputText, type: 'text' | 'voice' = 'text') => {
    if (!text.trim()) return;

    // 用户消息
    addMessage({
      id: Date.now().toString(),
      type: 'chat',
      content: text,
      timestamp: new Date(),
      isFromGrandson: false,
      messageType: type
    } as AIGrandsonMessage & { messageType: string });

    setInputText('');
    setIsTyping(true);

    // 模拟回复
    setTimeout(() => {
      const response = grandsonAgent.processUserInput(text);
      addMessage(response);
      setIsTyping(false);
    }, 1000);
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 格式化录音时间
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="wechat-container">
      {/* 顶部导航栏 - 微信风格 */}
      <div className="wechat-header">
        <button className="header-back" onClick={() => setCurrentScreen('home')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="header-title">
          小智
          <span className="header-subtitle">AI智能助手</span>
        </div>
        <button className="header-more">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* 消息区域 - 微信风格 */}
      <div className="wechat-messages">
        {messages.map((message, index) => {
          // 系统消息
          if (message.type === 'system') {
            return (
              <div key={message.id} className="system-message">
                {message.content}
              </div>
            );
          }

          // 普通消息
          return (
            <div
              key={message.id}
              className={`message-item ${message.isFromGrandson ? 'message-left' : 'message-right'}`}
            >
              {message.isFromGrandson && (
                <div className="message-avatar">
                  <span>🤖</span>
                </div>
              )}

              <div className="message-content-wrapper">
                <div className="message-bubble">
                  {/* 语音消息样式 */}
                  {(message as any).messageType === 'voice' ? (
                    <div className="voice-message">
                      <span className="voice-icon">🎤</span>
                      <span className="voice-duration">3"</span>
                      <div className="voice-waves">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  ) : (
                    <div className="message-text">{message.content}</div>
                  )}
                </div>
                <div className="message-time">{formatTime(message.timestamp)}</div>
              </div>

              {!message.isFromGrandson && (
                <div className="message-avatar">
                  <span>👤</span>
                </div>
              )}
            </div>
          );
        })}

        {/* 输入中提示 */}
        {isTyping && (
          <div className="message-item message-left">
            <div className="message-avatar">
              <span>🤖</span>
            </div>
            <div className="message-bubble typing-bubble">
              <span className="typing-text">对方正在输入</span>
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 底部输入区 - 微信风格 */}
      <div className="wechat-input-bar">
        {/* 正常输入状态 */}
        {!isListening ? (
          <>
            <button
              className="input-voice-toggle"
              onClick={() => {/* 切换到语音模式 */}}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C11.45 2 11 2.45 11 3V11C11 11.55 11.45 12 12 12C12.55 12 13 11.55 13 11V3C13 2.45 12.55 2 12 2Z" fill="currentColor"/>
                <path d="M12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5V11C15 12.66 13.66 14 12 14Z" fill="currentColor"/>
                <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill="currentColor"/>
              </svg>
            </button>

            <input
              type="text"
              className="text-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="请输入..."
            />

            <button
              className="input-emoji"
              onClick={() => setShowMoreActions(!showMoreActions)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
                <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
                <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            {inputText.trim() ? (
              <button className="send-button" onClick={() => handleSend()}>
                发送
              </button>
            ) : (
              <button className="more-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </>
        ) : (
          /* 录音状态 */
          <div className="recording-container">
            <button className="cancel-recording" onClick={stopRecording}>
              取消
            </button>

            <div className="recording-info">
              <div className="recording-animation">
                <span className="recording-dot"></span>
                <span className="recording-text">正在录音</span>
              </div>
              <div className="recording-time">{formatRecordingTime(recordingTime)}</div>
            </div>

            <button className="finish-recording" onClick={stopRecording}>
              完成
            </button>
          </div>
        )}

        {/* 按住说话按钮 - 始终显示 */}
        {!isListening && (
          <button
            className="voice-hold-button"
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
          >
            按住 说话
          </button>
        )}
      </div>

      {/* 更多功能面板 */}
      {showMoreActions && (
        <div className="more-actions-panel">
          <button className="action-item">
            <span className="action-icon">📷</span>
            <span className="action-label">相册</span>
          </button>
          <button className="action-item">
            <span className="action-icon">📸</span>
            <span className="action-label">拍摄</span>
          </button>
          <button className="action-item" onClick={() => setCurrentScreen('family')}>
            <span className="action-icon">📞</span>
            <span className="action-label">视频通话</span>
          </button>
          <button className="action-item">
            <span className="action-icon">📍</span>
            <span className="action-label">位置</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatScreen;