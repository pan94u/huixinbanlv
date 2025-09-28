import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ElderlyManagement from './pages/ElderlyManagement';
import HealthAnalytics from './pages/HealthAnalytics';
import AlertCenter from './pages/AlertCenter';
import ServiceOrders from './pages/ServiceOrders';
import StaffManagement from './pages/StaffManagement';
import 'antd/dist/reset.css';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="elderly" element={<ElderlyManagement />} />
            <Route path="health" element={<HealthAnalytics />} />
            <Route path="alerts" element={<AlertCenter />} />
            <Route path="orders" element={<ServiceOrders />} />
            <Route path="staff" element={<StaffManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
