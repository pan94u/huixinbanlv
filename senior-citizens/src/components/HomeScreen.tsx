import React, { useEffect, useState } from 'react';
import { GrandsonAvatar } from './GrandsonAvatar';
import { MessageBubble } from './MessageBubble';
import { ActionButton } from './ActionButton';
import { useAppStore } from '../store/useAppStore';
import { grandsonAgent } from '../services/GrandsonAgent';

export const HomeScreen: React.FC = () => {
  const {
    currentUser,
    grandsonMood,
    setGrandsonMood,
    messages,
    addMessage,
    setCurrentScreen,
    reminders
  } = useAppStore();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [grandsonMessage, setGrandsonMessage] = useState<string>('');

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Initialize grandson greeting
    if (currentUser) {
      grandsonAgent.setUser(currentUser);
      const greeting = grandsonAgent.getGreeting();
      setGrandsonMessage(greeting.content);
      setGrandsonMood(greeting.emotion || 'happy');
    }
  }, [currentUser, setGrandsonMood]);

  // Check for pending reminders
  const pendingReminders = reminders.filter(r => !r.completed);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const getWeatherIcon = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 18) return '☀️';
    return '🌙';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Status Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '15px',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '15px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>
          {formatTime(currentTime)}
        </div>
        <div style={{ fontSize: '24px', color: '#666' }}>
          {formatDate(currentTime)} {getWeatherIcon()}
        </div>
        <div style={{ fontSize: '20px', color: '#666' }}>
          🔋 85% 📶
        </div>
      </div>

      {/* User Status */}
      <div style={{
        textAlign: 'center',
        fontSize: '28px',
        color: '#333',
        marginBottom: '30px'
      }}>
        👴 {currentUser?.name}，今天心情不错！
      </div>

      {/* AI Grandson Area */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '40px',
        padding: '30px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <GrandsonAvatar mood={grandsonMood} size="large" />

        <div style={{
          marginTop: '20px',
          fontSize: '26px',
          color: '#333',
          textAlign: 'center',
          lineHeight: '1.6',
          maxWidth: '600px'
        }}>
          {grandsonMessage}
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'flex',
          gap: '20px',
          marginTop: '30px'
        }}>
          <ActionButton
            icon="🎵"
            label="播放音乐"
            onClick={() => console.log('Play music')}
          />
          <ActionButton
            icon="💬"
            label="聊天"
            onClick={() => setCurrentScreen('chat')}
          />
          <ActionButton
            icon="📞"
            label="呼叫家人"
            onClick={() => setCurrentScreen('family')}
          />
        </div>
      </div>

      {/* Status Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <StatusCard
          icon="🏠"
          title="今日陪伴"
          value={`聊天${messages.length}次`}
          color="#4CAF50"
        />
        <StatusCard
          icon="💝"
          title="亲情时光"
          value="收到2条留言"
          color="#E91E63"
        />
        <StatusCard
          icon="💊"
          title="健康提醒"
          value={`${pendingReminders.length}项待完成`}
          color="#FF9800"
          onClick={() => setCurrentScreen('health')}
        />
        <StatusCard
          icon="👨‍👩‍👦"
          title="家人联系"
          value="昨天通话"
          color="#2196F3"
        />
      </div>

      {/* Main Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '20px'
      }}>
        <BigActionButton
          label="一键呼叫"
          icon="📞"
          color="#FF5722"
          onClick={() => setCurrentScreen('call')}
        />
        <BigActionButton
          label="留言信箱"
          icon="💌"
          color="#9C27B0"
          onClick={() => console.log('Messages')}
        />
      </div>
    </div>
  );
};

// Status Card Component
const StatusCard: React.FC<{
  icon: string;
  title: string;
  value: string;
  color: string;
  onClick?: () => void;
}> = ({ icon, title, value, color, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: '20px',
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s',
      ':hover': {
        transform: 'scale(1.05)'
      }
    }}
  >
    <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
    <div style={{ fontSize: '20px', color: '#666', marginBottom: '5px' }}>{title}</div>
    <div style={{ fontSize: '24px', color, fontWeight: 'bold' }}>{value}</div>
  </div>
);

// Big Action Button Component
const BigActionButton: React.FC<{
  label: string;
  icon: string;
  color: string;
  onClick: () => void;
}> = ({ label, icon, color, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '25px 50px',
      fontSize: '28px',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: color,
      border: 'none',
      borderRadius: '15px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      transition: 'transform 0.2s',
      ':hover': {
        transform: 'scale(1.05)'
      }
    }}
  >
    <span style={{ fontSize: '36px' }}>{icon}</span>
    {label}
  </button>
);