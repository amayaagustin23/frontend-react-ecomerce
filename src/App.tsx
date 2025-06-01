import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router';
import 'antd/dist/reset.css';
import './styles/globals.scss';

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
