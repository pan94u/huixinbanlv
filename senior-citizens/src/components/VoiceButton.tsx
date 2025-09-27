import React from 'react';

interface VoiceButtonProps {
  isListening: boolean;
  onClick: () => void;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ isListening, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: isListening
          ? 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)'
          : 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s',
        animation: isListening ? 'pulse 1.5s infinite' : 'none'
      }}
    >
      <span style={{
        fontSize: '36px',
        color: 'white'
      }}>
        {isListening ? '⏸️' : '🎤'}
      </span>

      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(244, 67, 54, 0.4);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }
        }
      `}</style>
    </button>
  );
};