import React, { createContext, useContext, useState } from 'react';
import {
  createOrderFromCart,
  getUserOrders,
  getUserOrderById,
} from '@/services/calls/order.service';
import { Order } from '@/types/Order';

type OrderContextType = {
  createOrder: (cartId: string) => Promise<void>;
  fetchOrders: () => Promise<void>;
  getOrderById: (id: string) => Promise<Order | null>;
  orders: Order[];
  order: Order | undefined;
  ordersLoading: boolean;
  orderLoading: boolean;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [order, setOrder] = useState<Order>();
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const createOrder = async (cartId: string) => {
    try {
      const response = await createOrderFromCart(cartId);
      const preferenceUrl = response.data.preferenceUrl;

      if (preferenceUrl) {
        window.location.href = preferenceUrl;
      } else {
        console.error('❌ No se recibió la URL de preferencia');
      }
    } catch (error) {
      console.error('❌ Error al crear orden:', error);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await getUserOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('❌ Error al traer las órdenes:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const getOrderById = async (id: string): Promise<Order | null> => {
    setOrderLoading(true);
    try {
      const response = await getUserOrderById(id);
      setOrder(response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al traer la orden:', error);
      return null;
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        createOrder,
        fetchOrders,
        getOrderById,
        orders,
        order,
        ordersLoading,
        orderLoading,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder debe usarse dentro de un OrderProvider');
  return context;
};
