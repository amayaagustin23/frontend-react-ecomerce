import React, { createContext, useContext, useEffect, useState } from 'react';
import { Cart, CartItem } from '@/types/Cart';
import { getCart, updateCart, createCart } from '@/services/calls/cart.service';

type CartContextType = {
  cart: Cart | null;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  coupon: Cart['coupon'] | null;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const cartItems = cart?.items || [];
  const coupon = cart?.coupon || null;

  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCart(response.data);
    } catch (error) {
      console.error('❌ Error al obtener el carrito:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const setCartItems = (items: CartItem[]) => {
    setCart((prev) => (prev ? { ...prev, items } : null));
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
        return;
      }

      await updateCart(cartId, {
        itemsToAdd: [
          {
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          },
        ],
      });

      setCart((prev) => {
        if (!prev) return null;
        const exists = prev.items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );
        const newItems = exists
          ? prev.items.map((i) =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          : [...prev.items, item];
        return { ...prev, items: newItems };
      });
    } catch (error) {
      console.error('Error al agregar item', error);
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
      console.error('Error al actualizar cantidad', error);
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
      console.error('Error al eliminar item', error);
    }
  };

  const clearCart = () => setCart(null);

  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        setCartItems,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        getTotal,
        coupon,
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
