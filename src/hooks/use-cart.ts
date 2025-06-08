import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCart,
  addToCart as addToCartFirestore,
  removeFromCart as removeFromCartFirestore,
  updateCartItemQuantity,
  clearCartFirestore,
} from "@/lib/firestore";
import { CartItem, Product } from "@/types";
import { Timestamp } from "firebase/firestore";
import { off } from "process";
import { set } from "date-fns";

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [offerPercentage, setOfferPercentage] = useState<number>(0);
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

  const addToCart = async (
    product: Product,
    quantity: number = 1,
    size: string
  ) => {
    if (!currentUser) {
      return false;
    }

  
    if (checkDiscount(product)) {
      const discount = product.discount?.offerPercentage || 0;
      setOfferPercentage(discount);
    }

    try {
      const updatedCart = await addToCartFirestore(
        currentUser.uid,
        product,
        quantity,
        size,
        offerPercentage
      );
      setCartItems(updatedCart);
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string, size: string) => {
    if (!currentUser) {
      return false;
    }

    try {
      const updatedCart = await removeFromCartFirestore(
        currentUser.uid,
        productId,
        size
      );
      setCartItems(updatedCart);
      return true;
    } catch (error) {
      console.error("Error removing from cart:", error);
      return false;
    }
  };

  // Update item quantity
  const updateQuantity = async (productId: string, quantity: number, size:string) => {
    if (!currentUser) {
      return false;
    }

    try {
      const updatedCart = await updateCartItemQuantity(
        currentUser.uid,
        productId,
        quantity,
        size
      );
      setCartItems(updatedCart);
      return true;
    } catch (error) {
      console.error("Error updating quantity:", error);
      return false;
    }
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
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

  function checkDiscount(product: Product) {
    const today = new Date();
    // Convert Firebase Timestamp to JS Date
    const validUntil = (product.discount?.validDate as Timestamp)?.toDate();
    if (!validUntil) {
      return false;
    }
    if (today < validUntil) {
      return true;
    } else {
      return false;
    }
  }

  return {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    clearCart,
  };
};
