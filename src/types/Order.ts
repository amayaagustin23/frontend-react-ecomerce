export type Order = {
  id: string;
  userId: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  total: number;
  subtotal: number;
  shippingCost: number;
  paymentConfirmed: string | null;
  couponId: string | null;
  createdAt: string;
  items: OrderItem[];
};

export type OrderItem = {
  id: string;
  orderId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  finalPrice: number;
  productId: string;
  variantId: string;
  product: Product;
  variant: Variant;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  isService: boolean;
  isActive: boolean;
  hasDelivery: boolean;
  categoryId: string;
  brandId: string;
  images: ProductImage[];
  category: Category;
  brand: Brand;
};

export type ProductImage = {
  id: string;
  url: string;
  description: string;
  order: number;
  productId: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
};

export type Brand = {
  id: string;
  name: string;
  code: string | null;
};

export type Variant = {
  id: string;
  size: string;
  color: string;
  stock: number;
  productId: string;
};
