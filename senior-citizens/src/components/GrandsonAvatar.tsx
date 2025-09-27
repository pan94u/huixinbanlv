import React from 'react';

interface GrandsonAvatarProps {
  mood: 'happy' | 'caring' | 'worried' | 'encouraging';
  size?: 'small' | 'medium' | 'large';
  isAnimated?: boolean;
}

export const GrandsonAvatar: React.FC<GrandsonAvatarProps> = ({
  mood,
  size = 'medium',
  isAnimated = true
}) => {
  const sizeMap = {
    small: 80,
    medium: 150,
    large: 200
  };

  const moodEmojis = {
    happy: '😊',
    caring: '🤗',
    worried: '😟',
    encouraging: '💪'
  };

  const avatarSize = sizeMap[size];

  return (
    <div
      className={`grandson-avatar ${isAnimated ? 'animated' : ''}`}
      style={{
        width: avatarSize,
        height: avatarSize,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        animation: isAnimated ? 'pulse 2s infinite' : 'none'
      }}
    >
      <div style={{
        fontSize: avatarSize * 0.5,
        lineHeight: 1,
        userSelect: 'none'
      }}>
        {moodEmojis[mood]}
      </div>

      {/* Speech indicator */}
      {isAnimated && (
        <div
          className="speech-indicator"
          style={{
            position: 'absolute',
            bottom: -10,
            right: -10,
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: '#4CAF50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'bounce 1s infinite'
          }}
        >
          <span style={{ fontSize: 16 }}>💬</span>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};