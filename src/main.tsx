import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import { TaskList } from './components/TaskList';
import { TaskChart } from './components/analytics/TaskChart';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<div>Dashboard Page</div>} />
          <Route path="tasks" element={<TaskList />} />
          <Route path="analytics" element={<TaskChart />} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
