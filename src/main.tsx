import ReactDOM from 'react-dom/client';
import './i18n';
import App from './App';
import AppProviders from './context/App/AppProviders';
import 'antd/dist/reset.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppProviders>
    <App />
  </AppProviders>
);
