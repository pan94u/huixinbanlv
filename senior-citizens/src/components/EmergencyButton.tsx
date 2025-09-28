import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { grandsonAgent } from '../services/GrandsonAgent';

export const EmergencyButton: React.FC = () => {
  const { setEmergencyMode, addMessage, setGrandsonMood, currentUser } = useAppStore();
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [emergencyTriggered, setEmergencyTriggered] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isPressed && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isPressed && countdown === 0 && !emergencyTriggered) {
      triggerEmergency();
    }

    return () => clearTimeout(timer);
  }, [isPressed, countdown, emergencyTriggered]);

  const handlePressStart = () => {
    setIsPressed(true);
    setCountdown(5);
  };

  const handlePressEnd = () => {
    if (countdown > 0) {
      setIsPressed(false);
      setCountdown(5);

      // Short press - show instruction
      addMessage({
        id: Date.now().toString(),
        type: 'care',
        content: '爷爷，如果需要紧急求助，请长按5秒钟这个按钮。小智会立即通知家人的！',
        emotion: 'caring',
        timestamp: new Date(),
        isFromGrandson: true
      });
    }
  };

  const triggerEmergency = () => {
    setEmergencyTriggered(true);
    setEmergencyMode(true);
    setGrandsonMood('worried');

    // Grandson's emergency response
    const emergencyMessage = grandsonAgent.handleEmergency();
    addMessage(emergencyMessage);

    // Simulate emergency notification
    notifyEmergencyContacts();

    // Reset after 10 seconds
    setTimeout(() => {
      setEmergencyTriggered(false);
      setEmergencyMode(false);
      setIsPressed(false);
      setCountdown(5);
    }, 10000);
  };

  const notifyEmergencyContacts = () => {
    const contacts = currentUser?.healthData.emergencyContacts || [];

    // In production, this would send real notifications
    console.log('Notifying emergency contacts:', contacts);

    // Show notification in UI
    setTimeout(() => {
      addMessage({
        id: Date.now().toString(),
        type: 'care',
        content: '爷爷，小智已经成功通知了您的女儿张小丽，她马上就会联系您！请不要担心，小智会一直陪着您！',
        emotion: 'caring',
        timestamp: new Date(),
        isFromGrandson: true,
        actions: [
          { label: '拨打120', action: 'call_120', icon: '🚑' },
          { label: '查看位置', action: 'show_location', icon: '📍' }
        ]
      });
    }, 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 1000
      }}
    >
      <button
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: emergencyTriggered
            ? 'linear-gradient(135deg, #FF1744 0%, #D50000 100%)'
            : isPressed
            ? 'linear-gradient(135deg, #FF5722 0%, #F44336 100%)'
            : 'linear-gradient(135deg, #FF5722 0%, #FF7043 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s',
          animation: emergencyTriggered ? 'emergency-pulse 0.5s infinite' : 'none'
        }}
      >
        {emergencyTriggered ? (
          <>
            <span style={{ fontSize: '60px', color: 'white' }}>🚨</span>
            <span style={{ fontSize: '26px', color: 'white', marginTop: '5px', fontWeight: 'bold' }}>
              呼救中...
            </span>
          </>
        ) : isPressed ? (
          <>
            <span style={{ fontSize: '60px', color: 'white' }}>🆘</span>
            <span style={{ fontSize: '40px', color: 'white', fontWeight: 'bold' }}>
              {countdown}
            </span>
            <span style={{ fontSize: '22px', color: 'white', fontWeight: 'bold' }}>
              继续按住
            </span>
          </>
        ) : (
          <>
            <span style={{ fontSize: '60px', color: 'white' }}>🆘</span>
            <span style={{ fontSize: '26px', color: 'white', marginTop: '5px', fontWeight: 'bold' }}>
              紧急呼救
            </span>
          </>
        )}
      </button>

      <style>{`
        @keyframes emergency-pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 6px 20px rgba(255, 23, 68, 0.5);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 8px 30px rgba(255, 23, 68, 0.8);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 6px 20px rgba(255, 23, 68, 0.5);
          }
        }
      `}</style>
    </div>
  );
};