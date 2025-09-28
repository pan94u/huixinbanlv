import React from 'react';

interface ActionButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onClick,
  size = 'medium',
  color = '#2196F3'
}) => {
  const sizeStyles = {
    small: {
      padding: '12px 20px',
      fontSize: '22px',
      iconSize: '30px'
    },
    medium: {
      padding: '18px 30px',
      fontSize: '26px',
      iconSize: '38px'
    },
    large: {
      padding: '24px 40px',
      fontSize: '32px',
      iconSize: '48px'
    }
  };

  const style = sizeStyles[size];

  return (
    <button
      onClick={onClick}
      style={{
        padding: style.padding,
        fontSize: style.fontSize,
        background: 'white',
        border: `2px solid ${color}`,
        borderRadius: '15px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        ':hover': {
          background: color,
          color: 'white',
          transform: 'scale(1.05)'
        }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = color;
        e.currentTarget.style.color = 'white';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'white';
        e.currentTarget.style.color = 'inherit';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <span style={{ fontSize: style.iconSize }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
};