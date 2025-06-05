import { api } from '../api';
import { PANEL_ENDPOINTS } from '../endpoints';

export const getPanelDashboard = () => api.get(PANEL_ENDPOINTS.GET_DASHBOARD).then((res) => res);

export const getAllOrders = (params?: Record<string, any>) =>
  api.get(PANEL_ENDPOINTS.GET_ALL_ORDERS, { params }).then((res) => res);
