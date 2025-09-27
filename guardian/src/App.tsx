import React, { useEffect } from 'react';
import { useGuardianStore } from './store/useGuardianStore';
import { DashboardV2 } from './components/DashboardV2';
import { HealthMonitorV2 } from './components/HealthMonitorV2';
import { AlertCenterV2 } from './components/AlertCenterV2';
import { MessageCenterV2 } from './components/MessageCenterV2';
import './App.css';

function App() {
  const { currentScreen, initializeApp } = useGuardianStore();

  useEffect(() => {
    // Initialize the app with mock data
    initializeApp();
  }, [initializeApp]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardV2 />;
      case 'health':
        return <HealthMonitorV2 />;
      case 'alerts':
        return <AlertCenterV2 />;
      case 'messages':
        return <MessageCenterV2 />;
      case 'reminders':
        // For demo, show health monitor
        return <HealthMonitorV2 />;
      case 'services':
        // For demo, show dashboard
        return <DashboardV2 />;
      case 'settings':
        // For demo, show dashboard
        return <DashboardV2 />;
      default:
        return <DashboardV2 />;
    }
  };

  return (
    <div className="App">
      {renderScreen()}

      {/* Global Styles */}
      <style>{`
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

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}

export default App
