import React, { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { HomeScreenV2 } from './components/HomeScreenV2';
import { ChatScreen } from './components/ChatScreen';
import { HealthScreen } from './components/HealthScreen';
import { FamilyScreen } from './components/FamilyScreen';
import './App.css';
import './styles/global.css';
import './styles/accessibility.css';

function App() {
  const { currentScreen, initializeApp, emergencyMode } = useAppStore();

  useEffect(() => {
    // Initialize the app with mock data
    initializeApp();
  }, [initializeApp]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreenV2 />;
      case 'chat':
        return <ChatScreen />;
      case 'health':
        return <HealthScreen />;
      case 'family':
        return <FamilyScreen />;
      case 'call':
        // For demo purposes, show family screen
        return <FamilyScreen />;
      default:
        return <HomeScreenV2 />;
    }
  };

  return (
    <div className="App">
      {/* Emergency Mode Overlay */}
      {emergencyMode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 0, 0, 0.1)',
          pointerEvents: 'none',
          zIndex: 999,
          animation: 'emergency-flash 1s infinite'
        }}>
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#FF1744',
            color: 'white',
            padding: '20px 40px',
            borderRadius: '15px',
            fontSize: '32px',
            fontWeight: 'bold',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            🚨 紧急求助已发送
          </div>
        </div>
      )}

      {/* Main Content */}
      {renderScreen()}

      {/* Global Styles */}
      <style>{`
        @keyframes emergency-flash {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        button {
          font-family: inherit;
        }

        /* Accessibility - Large touch targets */
        button {
          min-width: 44px;
          min-height: 44px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          button {
            border: 2px solid currentColor;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App
