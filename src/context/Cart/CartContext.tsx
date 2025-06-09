import React, { createContext, useContext, useEffect, useState } from 'react';
import { Cart, CartItem } from '@/types/Cart';
import { getCart, updateCart, createCart } from '@/services/calls/cart.service';
import { useTranslation } from 'react-i18next';
import { useMessageApi } from '../Message/MessageContext';
import { useAuth } from '../Auth/AuthContext';

type CartContextType = {
  cart: Cart | null;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  addCouponCode: (id: string, body: { couponCode: string }) => void;
  clearCart: () => void;
  fetchCart: () => void;
  getTotal: () => number;
  getTotalFinalPrice: () => number;
  getQuantityTotal: () => number;

  coupon: Cart['coupon'] | null;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const [cart, setCart] = useState<Cart | null>(null);
  const cartItems = cart?.items || [];
  const coupon = cart?.coupon || null;
  const message = useMessageApi();
  const { user } = useAuth();

  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCart(response.data);
    } catch (error) {
      message.error(t('messages.error.fetchCart'));
    }
  };

  const addCouponCode = async (id: string, dto: { couponCode: string }) => {
    try {
      await updateCart(id, dto);
      await fetchCart();
      message.success(t('messages.success.couponCart'));
    } catch (error) {
      message.error(t('messages.error.couponCart'));
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const setCartItems = (items: CartItem[]) => {
    setCart((prev) => (prev ? { ...prev, items } : null));
  };

  const getQuantityTotal = () => {
    return cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  };

  const addToCart = async (item: CartItem) => {
    try {
      let cartId = cart?.id;

      if (!cartId) {
        const response = await createCart({
          items: [
            {
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
            },
          ],
        });
        cartId = response.data.id;
        setCart(response.data);
      } else {
        const productVariantExist = await cart?.items.find(
          ({ product, variant }) => item.productId === product.id && item.variantId === variant.id
        );
        if (productVariantExist) {
          await updateCart(cartId, {
            itemsToUpdate: [
              {
                id: productVariantExist.id,
                quantity: productVariantExist.quantity + item.quantity,
              },
            ],
          });
        } else {
          await updateCart(cartId, {
            itemsToAdd: [
              {
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
              },
            ],
          });
        }
      }
      fetchCart();
      message.success(t('messages.success.addToCart'));
    } catch (error) {
      console.error('❌', t('messages.error.addToCart'), error);
      message.error(t('messages.error.addToCart'));
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (!cart?.id) return;

      await updateCart(cart.id, { itemsToUpdate: [{ id: itemId, quantity }] });

      setCart((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
            }
          : null
      );
    } catch (error) {
      console.error('❌', t('messages.error.updateQuantity'), error);
      message.error(t('messages.error.updateQuantity'));
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      if (!cart?.id) return;

      await updateCart(cart.id, { itemsToDelete: [itemId] });

      setCart((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.filter((item) => item.id !== itemId),
            }
          : null
      );
    } catch (error) {
      console.error('❌', t('messages.error.removeItem'), error);
      message.error(t('messages.error.removeItem'));
    }
  };

  const clearCart = () => setCart(null);

  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  };
  const getTotalFinalPrice = () => {
    return cartItems.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        cartItems,
        setCartItems,
        addCouponCode,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        getTotal,
        coupon,
        getQuantityTotal,
        getTotalFinalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de un CartProvider');
  return context;
};
