
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';
import ProductFilters from '@/components/ProductFilters';
import { Separator } from '@/components/ui/separator';
import { useProducts } from '@/contexts/ProductContext';
import Footer from '@/components/Footer';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Products = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchParams] = useSearchParams();
  const { products, filteredProducts, setPriceRange, toggleCategory ,toggleCollection } = useProducts();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    debugger
    const category = searchParams.get('category');
    const price = searchParams.get('price');
    const collection = searchParams.get('collection');
    
    if (category) {
      toggleCategory(category);
    }
    
    if (price) {
      const priceValue = parseFloat(price);
      setPriceRange([0, priceValue]);
    }

    if (collection) {
      toggleCollection(collection);
    }

  }, [searchParams]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <main className="pt-24 pb-16 px-4 md:px-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <aside className={`md:block ${isFilterOpen ? 'block fixed inset-0 bg-background z-50 p-4' : 'hidden'}`}>
              {isFilterOpen && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-4 right-4 md:hidden"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
              <ProductFilters />
            </aside>
            
            <div className="md:hidden">
              <Button 
                onClick={() => setIsFilterOpen(true)}
                className="w-full py-2 px-4 bg-muted rounded-md text-sm font-medium"
                variant="outline"
              >
                Open Filters
              </Button>
            </div>

            <div className="md:col-span-3">
              <ProductGrid products={filteredProducts.length > 0 ? filteredProducts : products} />
            </div>
          </div>
        </div>
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Products;
