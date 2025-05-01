
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getCart, 
  addToCart as addToCartFirestore, 
  removeFromCart as removeFromCartFirestore,
  updateCartItemQuantity,
  clearCartFirestore
} from '@/lib/firestore';
import { CartItem, Product } from '@/types';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load cart items
  useEffect(() => {
    const loadCart = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const items = await getCart(currentUser.uid);
          setCartItems(items);
        } catch (error) {
          console.error("Error loading cart:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // For demo purposes, we'll keep an empty cart for non-authenticated users
        setCartItems([]);
        setLoading(false);
      }
    };

    loadCart();
  }, [currentUser]);

  // Add item to cart
  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!currentUser) {
      return false;
    }

    try {
      const updatedCart = await addToCartFirestore(currentUser.uid, product, quantity);
      setCartItems(updatedCart);
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string) => {
    if (!currentUser) {
      return false;
    }

    try {
      const updatedCart = await removeFromCartFirestore(currentUser.uid, productId);
      setCartItems(updatedCart);
      return true;
    } catch (error) {
      console.error("Error removing from cart:", error);
      return false;
    }
  };

  // Update item quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    if (!currentUser) {
      return false;
    }

    try {
      const updatedCart = await updateCartItemQuantity(currentUser.uid, productId, quantity);
      setCartItems(updatedCart);
      return true;
    } catch (error) {
      console.error("Error updating quantity:", error);
      return false;
    }
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get cart count
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = async () => {
    if (!currentUser) {
      return false;
    }

    try {
      await clearCartFirestore(currentUser.uid);
      setCartItems([]);
      return true;
    } catch (error) {
      console.error("Error clearing cart:", error);
      return false;
    }
  };

  return {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    clearCart
  };
};
