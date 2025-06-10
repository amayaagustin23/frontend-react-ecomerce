export type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  cuitOrDni: string;
  role: 'CLIENT' | 'ADMIN' | 'SELLER';
  points: number;
  addresses: Address[];
};

export type AddressInputDto = {
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    lat?: number | null;
    lng?: number | null;
  };
};

export interface UserWithOrders {
  id: string;
  email: string;
  role: 'ADMIN' | 'CLIENT' | 'SUPERADMIN';
  points: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  person?: Person;
  addresses: Address[];
  orders: Order[];
}

export interface Person {
  id: string;
  name: string;
  phone?: string;
  cuitOrDni?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
  lat?: number | null;
  lng?: number | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED';
  total: number;
  subtotal: number;
  shippingCost: number;
  paymentConfirmed?: string | null;
  couponId?: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  payment?: Payment;
  shippingInfo?: ShippingInfo | null;
  items: OrderItem[];
}

export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  method: 'MERCADOPAGO' | 'CREDIT_CARD' | 'BANK_TRANSFER';
  status: 'PENDING' | 'PAID' | 'FAILED';
  amount: number;
  mpPaymentId?: string | null;
  mpStatus?: string | null;
  mpStatusDetail?: string | null;
  mpExternalReference?: string | null;
  mpPreferenceId?: string | null;
}

export interface ShippingInfo {
  id: string;
  orderId: string;
  addressId: string;
  shippingProvider: string;
  trackingCode: string;
  estimatedDelivery: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  finalPrice: number;
  productId: string;
  variantId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  product: Product;
  variant: ProductVariant;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
}

export interface Category {
  id: string;
  name: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
}
