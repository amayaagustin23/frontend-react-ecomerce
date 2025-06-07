import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router';
import { ConfigProvider, theme as antdTheme } from 'antd';
import esES from 'antd/locale/es_ES';
import './styles/globals.scss';
import 'antd/dist/reset.css';

import { ThemeProvider, useTheme } from './context/Theme/ThemeContext';
import { lightTheme, darkTheme } from './theme/themeConfig';

const AppContent = () => {
  const { mode } = useTheme();
  const isDarkMode = mode === 'dark';

  return (
    <ConfigProvider
      locale={esES}
      theme={{
        ...(isDarkMode ? darkTheme : lightTheme),
        algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ConfigProvider>
  );
};

const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
