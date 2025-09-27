import React from 'react';
import type { AIGrandsonMessage } from '../types/index';

interface MessageBubbleProps {
  message: AIGrandsonMessage;
  onAction?: (action: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onAction }) => {
  const isGrandson = message.isFromGrandson;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isGrandson ? 'flex-start' : 'flex-end',
        marginBottom: '15px'
      }}
    >
      <div
        style={{
          maxWidth: '70%',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {/* Message Bubble */}
        <div
          style={{
            padding: '15px 20px',
            borderRadius: '20px',
            background: isGrandson
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : '#E8F5E9',
            color: isGrandson ? 'white' : '#333',
            fontSize: '24px',
            lineHeight: '1.5',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }}
        >
          {isGrandson && message.emotion && (
            <div style={{ marginBottom: '10px', fontSize: '20px', opacity: 0.9 }}>
              {message.emotion === 'happy' && '😊 小智开心地说：'}
              {message.emotion === 'caring' && '🤗 小智关心地说：'}
              {message.emotion === 'worried' && '😟 小智担心地说：'}
              {message.emotion === 'encouraging' && '💪 小智鼓励地说：'}
            </div>
          )}

          {message.content}
        </div>

        {/* Action Buttons */}
        {message.actions && message.actions.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap'
            }}
          >
            {message.actions.map((action, index) => (
              <button
                key={index}
                onClick={() => onAction?.(action.action)}
                style={{
                  padding: '10px 15px',
                  fontSize: '20px',
                  background: 'white',
                  border: '2px solid #667eea',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  ':hover': {
                    background: '#667eea',
                    color: 'white'
                  }
                }}
              >
                {action.icon && <span>{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <div
          style={{
            fontSize: '16px',
            color: '#999',
            textAlign: isGrandson ? 'left' : 'right'
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  );
};