import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import '../styles/global.css';

export const HealthScreen: React.FC = () => {
  const { reminders, healthData, setCurrentScreen, updateReminder } = useAppStore();
  const [activeTab, setActiveTab] = useState<'reminders' | 'vitals' | 'history'>('reminders');

  const todayVitals = {
    bloodPressure: '125/82',
    heartRate: 72,
    steps: 2856,
    sleep: '7.5小时',
    medication: true
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    return `${hour}:${minute}`;
  };

  const handleReminderToggle = (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      updateReminder(id, { completed: !reminder.completed });
    }
  };

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="health-header safe-top">
        <button className="nav-back touch-feedback" onClick={() => setCurrentScreen('home')}>
          <span className="back-icon">‹</span>
        </button>
        <h2 className="header-title">健康管理</h2>
        <button className="header-action touch-feedback">
          <span className="action-icon">📊</span>
        </button>
      </div>

      {/* Today's Summary Card */}
      <div className="health-summary-card">
        <h3 className="summary-title">今日健康状况</h3>
        <div className="health-status">
          <span className="status-indicator good"></span>
          <span className="status-text">状态良好</span>
        </div>
        <p className="health-advice">小智提醒：今天记得多喝水，保持适量运动哦！</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav">
        <button
          className={`tab-item ${activeTab === 'reminders' ? 'active' : ''}`}
          onClick={() => setActiveTab('reminders')}
        >
          <span className="tab-icon">💊</span>
          <span className="tab-label">用药提醒</span>
        </button>
        <button
          className={`tab-item ${activeTab === 'vitals' ? 'active' : ''}`}
          onClick={() => setActiveTab('vitals')}
        >
          <span className="tab-icon">❤️</span>
          <span className="tab-label">生命体征</span>
        </button>
        <button
          className={`tab-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <span className="tab-icon">📈</span>
          <span className="tab-label">健康记录</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'reminders' && (
          <div className="reminders-list">
            {reminders.map(reminder => (
              <div key={reminder.id} className="reminder-card touch-feedback">
                <div className="reminder-icon">
                  {reminder.type === 'medication' ? '💊' :
                   reminder.type === 'checkup' ? '🩺' :
                   reminder.type === 'exercise' ? '🚶' : '💧'}
                </div>
                <div className="reminder-info">
                  <h4 className="reminder-title">{reminder.title}</h4>
                  <p className="reminder-desc">{reminder.description}</p>
                  <p className="reminder-time">
                    <span className="time-icon">⏰</span>
                    {formatTime(reminder.time)}
                  </p>
                </div>
                <button
                  className={`reminder-check ${reminder.completed ? 'checked' : ''}`}
                  onClick={() => handleReminderToggle(reminder.id)}
                >
                  {reminder.completed ? '✓' : ''}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="vitals-grid">
            <div className="vital-card touch-feedback">
              <div className="vital-icon">🩸</div>
              <div className="vital-value">{todayVitals.bloodPressure}</div>
              <div className="vital-label">血压</div>
              <div className="vital-status normal">正常</div>
            </div>
            <div className="vital-card touch-feedback">
              <div className="vital-icon">❤️</div>
              <div className="vital-value">{todayVitals.heartRate}</div>
              <div className="vital-label">心率</div>
              <div className="vital-status normal">正常</div>
            </div>
            <div className="vital-card touch-feedback">
              <div className="vital-icon">👣</div>
              <div className="vital-value">{todayVitals.steps}</div>
              <div className="vital-label">步数</div>
              <div className="vital-status good">良好</div>
            </div>
            <div className="vital-card touch-feedback">
              <div className="vital-icon">😴</div>
              <div className="vital-value">{todayVitals.sleep}</div>
              <div className="vital-label">睡眠</div>
              <div className="vital-status good">优秀</div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-list">
            <div className="history-item">
              <div className="history-date">12月27日</div>
              <div className="history-entries">
                <div className="entry-item">
                  <span className="entry-icon">💊</span>
                  <span className="entry-text">已完成所有用药</span>
                </div>
                <div className="entry-item">
                  <span className="entry-icon">🩸</span>
                  <span className="entry-text">血压: 128/85 (偏高)</span>
                </div>
              </div>
            </div>
            <div className="history-item">
              <div className="history-date">12月26日</div>
              <div className="history-entries">
                <div className="entry-item">
                  <span className="entry-icon">👣</span>
                  <span className="entry-text">步数: 3,420步</span>
                </div>
                <div className="entry-item">
                  <span className="entry-icon">😴</span>
                  <span className="entry-text">睡眠: 8小时 (优秀)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Button */}
      <button className="float-action-btn touch-feedback">
        <span className="fab-icon">+</span>
        <span className="fab-label">记录健康数据</span>
      </button>

      <style jsx>{`
        .health-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: white;
          border-bottom: 1px solid #F0F0F0;
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

        .header-title {
          flex: 1;
          text-align: center;
          font-size: 18px;
          font-weight: 600;
          color: #1A1A1A;
          margin: 0;
        }

        .header-action {
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .action-icon {
          font-size: 24px;
        }

        .health-summary-card {
          background: white;
          margin: 16px;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .summary-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
        }

        .health-status {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .status-indicator.good {
          background: #4CAF50;
        }

        .status-text {
          font-size: 18px;
          font-weight: 500;
          color: #4CAF50;
        }

        .health-advice {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .tab-nav {
          display: flex;
          background: white;
          border-bottom: 1px solid #F0F0F0;
        }

        .tab-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 12px;
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
        }

        .tab-item.active {
          color: #007AFF;
        }

        .tab-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #007AFF;
        }

        .tab-icon {
          font-size: 20px;
        }

        .tab-label {
          font-size: 13px;
          color: inherit;
        }

        .tab-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          padding-bottom: 80px;
        }

        .reminders-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .reminder-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .reminder-icon {
          font-size: 32px;
        }

        .reminder-info {
          flex: 1;
        }

        .reminder-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0 0 4px 0;
        }

        .reminder-desc {
          font-size: 14px;
          color: #666;
          margin: 0 0 8px 0;
        }

        .reminder-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: #999;
          margin: 0;
        }

        .time-icon {
          font-size: 14px;
        }

        .reminder-check {
          width: 32px;
          height: 32px;
          border: 2px solid #E0E0E0;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          color: white;
        }

        .reminder-check.checked {
          background: #4CAF50;
          border-color: #4CAF50;
        }

        .vitals-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .vital-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .vital-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .vital-value {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .vital-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
        }

        .vital-status {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .vital-status.normal {
          background: #E3F2FD;
          color: #2196F3;
        }

        .vital-status.good {
          background: #E8F5E9;
          color: #4CAF50;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .history-item {
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .history-date {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
        }

        .history-entries {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .entry-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #666;
        }

        .entry-icon {
          font-size: 16px;
        }

        .float-action-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 24px;
          background: #007AFF;
          color: white;
          border: none;
          border-radius: 24px;
          box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
          cursor: pointer;
        }

        .fab-icon {
          font-size: 20px;
        }

        .fab-label {
          font-size: 16px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};