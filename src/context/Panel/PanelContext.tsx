import { getPanelDashboard } from '@/services/calls/panel.service';
import React, { createContext, useContext, useEffect, useState } from 'react';

type StatusCount = { status: string; count: number };

type ProductInfo = {
  id: string;
  name: string;
  price: number;
  totalSold: number;
};

type CouponInfo = {
  id: string;
  description: string;
  code: string;
  total: number;
};

type OrderByDay = {
  date: string;
  count: number;
};

interface DashboardData {
  ordersCountPaid: number;
  usersCount: number;
  productsCount: number;
  cartStatusReport: StatusCount[];
  paymentStatusReport: StatusCount[];
  productsMostSoldWithDetails: ProductInfo[];
  couponsMostUsed: CouponInfo[];
  orderListForDays: OrderByDay[];
}

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

  const fetchDashboard = async () => {
    try {
      const res = await getPanelDashboard();
      setData(res.data);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
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
