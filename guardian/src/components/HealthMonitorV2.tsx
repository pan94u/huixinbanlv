import React, { useState } from 'react';
import { useGuardianStore } from '../store/useGuardianStore';
import '../styles/global.css';

export const HealthMonitorV2: React.FC = () => {
  const { selectedParent, healthHistory, setCurrentScreen } = useGuardianStore();
  const [activeTab, setActiveTab] = useState<'vitals' | 'trends' | 'medications'>('vitals');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'day' | 'week' | 'month'>('day');

  const latestHealthData = healthHistory[0] || {
    bloodPressure: { systolic: 125, diastolic: 82 },
    heartRate: 72,
    steps: 2856,
    sleep: { duration: 7.5, quality: 'good' },
    medicationTaken: true
  };

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="nav-header safe-top">
        <button className="nav-back touch-feedback" onClick={() => setCurrentScreen('dashboard')}>
          <span className="back-icon">‹</span>
        </button>
        <h2 className="nav-title">健康监测</h2>
        <button className="nav-action touch-feedback">
          <span className="action-icon">📤</span>
        </button>
      </div>

      {/* Parent Info Bar */}
      <div className="parent-info-bar">
        <div className="parent-avatar-small">
          <span>👴</span>
        </div>
        <div className="parent-info-text">
          <p className="parent-name">{selectedParent?.name || '张大爷'}</p>
          <p className="parent-update">数据更新于 5分钟前</p>
        </div>
        <div className="ai-status">
          <span className="ai-icon">🤖</span>
          <span className="ai-text">小智监护中</span>
        </div>
      </div>

      {/* Health Score Card */}
      <div className="health-score-card">
        <div className="score-circle">
          <svg className="score-ring" viewBox="0 0 120 120">
            <circle
              className="score-ring-bg"
              cx="60"
              cy="60"
              r="52"
              strokeWidth="12"
              fill="none"
              stroke="#F0F0F0"
            />
            <circle
              className="score-ring-progress"
              cx="60"
              cy="60"
              r="52"
              strokeWidth="12"
              fill="none"
              stroke="#34C759"
              strokeDasharray={`${2 * Math.PI * 52 * 0.85} ${2 * Math.PI * 52}`}
              strokeDashoffset={2 * Math.PI * 52 * 0.25}
              strokeLinecap="round"
            />
          </svg>
          <div className="score-value">
            <span className="score-number">85</span>
            <span className="score-label">健康分</span>
          </div>
        </div>
        <div className="score-details">
          <p className="score-status">整体状况良好</p>
          <p className="score-advice">小智提醒：父亲今天各项指标正常，记得保持适量运动</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav">
        <button
          className={`tab-item ${activeTab === 'vitals' ? 'active' : ''}`}
          onClick={() => setActiveTab('vitals')}
        >
          <span className="tab-icon">❤️</span>
          <span className="tab-label">生命体征</span>
        </button>
        <button
          className={`tab-item ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          <span className="tab-icon">📊</span>
          <span className="tab-label">趋势分析</span>
        </button>
        <button
          className={`tab-item ${activeTab === 'medications' ? 'active' : ''}`}
          onClick={() => setActiveTab('medications')}
        >
          <span className="tab-icon">💊</span>
          <span className="tab-label">用药记录</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'vitals' && (
          <div className="vitals-content">
            <div className="vital-card primary">
              <div className="vital-header">
                <span className="vital-icon">🩸</span>
                <span className="vital-name">血压</span>
                <span className="vital-status normal">正常</span>
              </div>
              <div className="vital-value-large">
                {latestHealthData.bloodPressure?.systolic || '--'}/{latestHealthData.bloodPressure?.diastolic || '--'}
                <span className="vital-unit">mmHg</span>
              </div>
              <div className="vital-trend">
                <span className="trend-icon">📈</span>
                <span className="trend-text">较昨天上升 3%</span>
              </div>
              <div className="vital-ai-note">
                <span className="ai-avatar">🤖</span>
                <span className="ai-message">小智观察：血压稳定在正常范围内</span>
              </div>
            </div>

            <div className="vitals-grid">
              <div className="vital-card-small">
                <div className="vital-icon">❤️</div>
                <div className="vital-label">心率</div>
                <div className="vital-value">{latestHealthData.heartRate || '--'}</div>
                <div className="vital-unit">次/分</div>
              </div>
              <div className="vital-card-small">
                <div className="vital-icon">👣</div>
                <div className="vital-label">步数</div>
                <div className="vital-value">{latestHealthData.steps || '--'}</div>
                <div className="vital-unit">步</div>
              </div>
              <div className="vital-card-small">
                <div className="vital-icon">😴</div>
                <div className="vital-label">睡眠</div>
                <div className="vital-value">{latestHealthData.sleep?.duration || '--'}</div>
                <div className="vital-unit">小时</div>
              </div>
              <div className="vital-card-small">
                <div className="vital-icon">🌡️</div>
                <div className="vital-label">体温</div>
                <div className="vital-value">36.5</div>
                <div className="vital-unit">°C</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="trends-content">
            <div className="time-range-selector">
              {(['day', 'week', 'month'] as const).map(range => (
                <button
                  key={range}
                  className={`range-btn ${selectedTimeRange === range ? 'active' : ''}`}
                  onClick={() => setSelectedTimeRange(range)}
                >
                  {range === 'day' ? '今日' : range === 'week' ? '本周' : '本月'}
                </button>
              ))}
            </div>

            <div className="chart-placeholder">
              <div className="chart-header">
                <span className="chart-title">血压趋势</span>
                <span className="chart-value">125/82 mmHg</span>
              </div>
              <div className="mini-chart">
                {/* Simplified chart representation */}
                <div className="chart-bars">
                  {[65, 70, 68, 72, 75, 73, 72].map((height, i) => (
                    <div
                      key={i}
                      className="chart-bar"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="trend-insights">
              <h3 className="insights-title">AI健康洞察</h3>
              <div className="insight-item">
                <span className="insight-icon">📊</span>
                <p className="insight-text">血压在过去一周内保持稳定，波动在正常范围内</p>
              </div>
              <div className="insight-item">
                <span className="insight-icon">💡</span>
                <p className="insight-text">建议继续保持当前的用药和生活习惯</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="medications-content">
            <div className="medication-summary">
              <div className="summary-stat">
                <span className="stat-value">100%</span>
                <span className="stat-label">今日服药率</span>
              </div>
              <div className="summary-stat">
                <span className="stat-value">3</span>
                <span className="stat-label">日常药物</span>
              </div>
            </div>

            <div className="medication-list">
              <div className="medication-card">
                <div className="med-icon">💊</div>
                <div className="med-info">
                  <h4 className="med-name">降压药</h4>
                  <p className="med-schedule">每日三次，饭后服用</p>
                  <p className="med-status">
                    <span className="status-check">✓</span>
                    今日已服用 2/3 次
                  </p>
                </div>
                <div className="med-time">
                  <p className="next-dose">下次</p>
                  <p className="dose-time">18:00</p>
                </div>
              </div>

              <div className="medication-card">
                <div className="med-icon">💊</div>
                <div className="med-info">
                  <h4 className="med-name">钙片</h4>
                  <p className="med-schedule">每日一次，睡前服用</p>
                  <p className="med-status pending">
                    <span className="status-pending">⏰</span>
                    待服用
                  </p>
                </div>
                <div className="med-time">
                  <p className="next-dose">今晚</p>
                  <p className="dose-time">21:00</p>
                </div>
              </div>
            </div>

            <div className="ai-reminder">
              <span className="reminder-icon">🤖</span>
              <p className="reminder-text">小智会准时提醒爸爸服药，并温柔地陪伴他完成</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .nav-header {
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
        }

        .back-icon {
          font-size: 28px;
          color: #333;
        }

        .nav-title {
          flex: 1;
          text-align: center;
          font-size: 18px;
          font-weight: 600;
          color: #1A1A1A;
          margin: 0;
        }

        .nav-action {
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

        .parent-info-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #F8F9FA;
          border-bottom: 1px solid #F0F0F0;
        }

        .parent-avatar-small {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #FFE0B2, #FFCC80);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .parent-info-text {
          flex: 1;
        }

        .parent-name {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        .parent-update {
          font-size: 12px;
          color: #999;
          margin: 0;
        }

        .ai-status {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #E8F5E9;
          border-radius: 16px;
        }

        .ai-icon {
          font-size: 16px;
        }

        .ai-text {
          font-size: 13px;
          color: #2E7D32;
        }

        .health-score-card {
          margin: 16px;
          padding: 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .score-circle {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .score-ring {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .score-value {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .score-number {
          display: block;
          font-size: 32px;
          font-weight: 700;
          color: #34C759;
        }

        .score-label {
          display: block;
          font-size: 12px;
          color: #666;
        }

        .score-details {
          flex: 1;
        }

        .score-status {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin: 0 0 8px 0;
        }

        .score-advice {
          font-size: 14px;
          color: #666;
          margin: 0;
          line-height: 1.4;
        }

        .tab-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          padding-bottom: 32px;
        }

        .vital-card {
          background: white;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .vital-card.primary {
          background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
        }

        .vital-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .vital-icon {
          font-size: 24px;
        }

        .vital-name {
          flex: 1;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .vital-status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .vital-status.normal {
          background: #E8F5E9;
          color: #2E7D32;
        }

        .vital-value-large {
          font-size: 36px;
          font-weight: 700;
          color: #1976D2;
          margin-bottom: 8px;
        }

        .vital-unit {
          font-size: 16px;
          font-weight: 400;
          color: #666;
          margin-left: 8px;
        }

        .vital-trend {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }

        .trend-icon {
          font-size: 16px;
        }

        .trend-text {
          font-size: 13px;
          color: #666;
        }

        .vital-ai-note {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 8px;
        }

        .ai-avatar {
          font-size: 20px;
        }

        .ai-message {
          font-size: 13px;
          color: #424242;
        }

        .vitals-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .vital-card-small {
          background: white;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .vital-label {
          font-size: 13px;
          color: #666;
          margin: 4px 0;
        }

        .vital-value {
          font-size: 24px;
          font-weight: 600;
          color: #333;
        }

        .time-range-selector {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .range-btn {
          flex: 1;
          padding: 8px;
          background: #F5F5F5;
          border: 1px solid #E0E0E0;
          border-radius: 8px;
          font-size: 14px;
          color: #666;
          cursor: pointer;
        }

        .range-btn.active {
          background: #007AFF;
          color: white;
          border-color: #007AFF;
        }

        .chart-placeholder {
          background: white;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .chart-title {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .chart-value {
          font-size: 14px;
          color: #007AFF;
        }

        .mini-chart {
          height: 100px;
          position: relative;
        }

        .chart-bars {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 100%;
          gap: 4px;
        }

        .chart-bar {
          flex: 1;
          background: linear-gradient(to top, #007AFF, #5AC8FA);
          border-radius: 4px 4px 0 0;
        }

        .trend-insights {
          background: #F8F9FA;
          border-radius: 12px;
          padding: 16px;
        }

        .insights-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0 0 12px 0;
        }

        .insight-item {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .insight-item:last-child {
          margin-bottom: 0;
        }

        .insight-icon {
          font-size: 20px;
        }

        .insight-text {
          flex: 1;
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .medication-summary {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }

        .summary-stat {
          flex: 1;
          text-align: center;
          padding: 16px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .stat-value {
          display: block;
          font-size: 28px;
          font-weight: 700;
          color: #34C759;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 13px;
          color: #666;
        }

        .medication-list {
          margin-bottom: 16px;
        }

        .medication-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: white;
          border-radius: 12px;
          margin-bottom: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .med-icon {
          font-size: 32px;
        }

        .med-info {
          flex: 1;
        }

        .med-name {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0 0 4px 0;
        }

        .med-schedule {
          font-size: 13px;
          color: #666;
          margin: 0 0 8px 0;
        }

        .med-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #34C759;
          margin: 0;
        }

        .med-status.pending {
          color: #FF9500;
        }

        .status-check {
          font-size: 16px;
        }

        .status-pending {
          font-size: 16px;
        }

        .med-time {
          text-align: center;
        }

        .next-dose {
          font-size: 12px;
          color: #999;
          margin: 0 0 4px 0;
        }

        .dose-time {
          font-size: 18px;
          font-weight: 600;
          color: #007AFF;
          margin: 0;
        }

        .ai-reminder {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: linear-gradient(135deg, #E8EAF6, #C5CAE9);
          border-radius: 12px;
        }

        .reminder-icon {
          font-size: 24px;
        }

        .reminder-text {
          flex: 1;
          font-size: 14px;
          color: #424242;
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
          color: #666;
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
      `}</style>
    </div>
  );
};