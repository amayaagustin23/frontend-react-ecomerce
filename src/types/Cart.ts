import { Product, Variant } from './Product';

export type CartItem = {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  finalPrice: number;
  product: Product;
  variant: Variant;
};

export type Coupon = {
  id: string;
  code: string;
  discount: number;
};

export type Cart = {
  id: string;
  status: 'ACTIVE' | 'COMPLETED';
  userId: string;
  couponId: string | null;
  coupon: Coupon | null;
  items: CartItem[];
};

export type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
};
export type CreateItems = {
  productId: string;
  variantId: string;
  quantity: number;
};
export type CreateCartDto = {
  items: CreateItems[];
  couponCode?: string;
};

export type UpdateCartDto = {
  itemsToUpdate?: {
    id: string;
    quantity: number;
  }[];
  itemsToAdd?: CreateItems[];
  itemsToDelete?: string[];
};
