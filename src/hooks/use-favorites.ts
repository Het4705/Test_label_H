
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getFavorites, toggleFavorite as toggleFavoriteFirestore } from '@/lib/firestore';
import { useAuthDialog } from '@/contexts/AuthDialogContext';
import { Product } from '@/types';

export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, userProfile } = useAuth();
  const { openLogin } = useAuthDialog();

  // Load favorite items from user profile
  useEffect(() => {
    const loadFavorites = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          // If we already have favorites in the user profile, use those
          if (userProfile && userProfile.favorites) {
            setFavoriteIds(userProfile.favorites);
          } else {
            // Otherwise fetch them from Firestore
            const favorites = await getFavorites(currentUser.uid);
            setFavoriteIds(favorites);
          }
        } catch (error) {
          console.error("Error loading favorites:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // For non-authenticated users, return empty favorites
        setFavoriteIds([]);
        setLoading(false);
      }
    };

    loadFavorites();
  }, [currentUser, userProfile]);

  // Toggle favorite status
  const toggleFavorite = async (productId: string) => {
    if (!currentUser) {
      openLogin();
      return { isFavorite: false, success: false };
    }

    try {
      const result = await toggleFavoriteFirestore(currentUser.uid, productId);
      setFavoriteIds(result.favorites);
      return { isFavorite: result.added, success: true };
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return { isFavorite: favoriteIds.includes(productId), success: false };
    }
  };

  // Check if product is a favorite
  const isFavorite = (productId: string) => {
    return favoriteIds.includes(productId);
  };

  // Get all favorite products
  const getFavoriteProducts = (allProducts?: Product[]) => {
    if (!allProducts) return [];
    return allProducts.filter(product => favoriteIds.includes(product.id));
  };

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    getFavoriteProducts,
    loading,
  };
};
