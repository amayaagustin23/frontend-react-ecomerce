import { getPanelDashboard } from '@/services/calls/panel.service';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMessageApi } from '../Message/MessageContext';

export interface DashboardData {
  kpis: {
    totalProfit: number;
    totalRevenue: number;
    ordersCountPaid: number;
    usersCount: number;
    productsCount: number;
    averageOrderValue: number;
    repeatPurchaseRate: number;
    customerLifetimeValue: number;
  };
  reports: {
    orderListForDays: OrderByDay[];
    cartStatusReport: StatusCount[];
    paymentStatusReport: StatusCount[];
  };
  highlights: {
    productsMostSoldWithDetails: ProductInfo[];
    topProfitableProducts: ProductProfitInfo[];
    couponsMostUsed: CouponInfo[];
  };
}

export type StatusCount = {
  status: string;
  count: number;
};

export type ProductInfo = {
  id: string;
  name: string;
  price: number;
  totalSold: number;
};

export type ProductProfitInfo = {
  id: string;
  name: string;
  profit: number;
};

export type CouponInfo = {
  id: string;
  description: string;
  code: string;
  total: number;
};

export type OrderByDay = {
  date: string;
  count: number;
};

interface DashboardContextProps {
  data: DashboardData | null;
  loading: boolean;
  fetchDashboard: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextProps>({
  data: null,
  loading: false,
  fetchDashboard: async () => {
    console.warn('fetchDashboard function not implemented');
  },
});

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const message = useMessageApi();

  const fetchDashboard = async () => {
    try {
      const res = await getPanelDashboard();
      setData(res.data);
    } catch (error) {
      message.error('Error cargando dashboard:');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContext.Provider value={{ data, loading, fetchDashboard }}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;

export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error('useDashboard debe usarse dentro de un DashboardProvider');
  }

  return context;
};
