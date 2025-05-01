import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, Gender } from '@/types';
import { getProducts } from "@/lib/firestore";
import { toast } from '@/hooks/use-toast';

interface ProductContextType {
  products: Product[];
  filteredProducts: Product[];
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  toggleCollection: (category: string) => void;
  selectedMaterials: string[];
  toggleMaterial: (material: string) => void;
  showDiscounted: boolean;
  setShowDiscounted: (show: boolean) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [showDiscounted, setShowDiscounted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const productsList = await getProducts();
        setProducts(productsList);
        setFilteredProducts(productsList);
        setIsLoading(false);
      } catch (error: any) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error fetching products",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  const applyFilters = useCallback(() => {
    debugger
    let result = [...products];
    
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    if (selectedCategories.length > 0) {
      result = result.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
    
    if (selectedMaterials.length > 0) {
      result = result.filter(product => 
        selectedMaterials.includes(product.material)
      );
    }

    if(selectedCollections.length>0){
      result = result.filter(product => selectedCollections.includes(product.collectionId))
    }
    
    if (showDiscounted) {
      result = result.filter(product => product.discount && product.discount.offerPercentage > 0);
    }
    
    setFilteredProducts(result);
  }, [products, priceRange, selectedCategories, selectedMaterials, showDiscounted , selectedCollections]);
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };


  const toggleCollection = (collection: string) => {
    setSelectedCollections(prev => {
      if (prev.includes(collection)) {
        return prev.filter(c => c !== collection);
      } else {
        return [...prev, collection];
      }
    });
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials(prev => {
      if (prev.includes(material)) {
        return prev.filter(m => m !== material);
      } else {
        return [...prev, material];
      }
    });
  };
  
  const resetFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setShowDiscounted(false);
  };
  
  return (
    <ProductContext.Provider value={{
      products,
      filteredProducts,
      priceRange,
      setPriceRange,
      selectedCategories,
      toggleCategory,
      toggleCollection,
      selectedMaterials,
      toggleMaterial,
      showDiscounted,
      setShowDiscounted,
      resetFilters,
      applyFilters,
      isLoading,
    }}>
      {children}
    </ProductContext.Provider>
  );
};
