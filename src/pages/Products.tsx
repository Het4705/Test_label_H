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
  const {
    products,
    filteredProducts,
    setPriceRange,
    toggleCategory,
    selectedCategories,
    selectedMaterials,
    showDiscounted,
    priceRange,
    selectedCollections,
    setSelectedCollections,
    isLoading, // <-- make sure this is provided by your context
  } = useProducts();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
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
      setSelectedCollections((prev) =>
        prev.includes(collection) ? prev : [...prev, collection]
      );
    }
  }, [searchParams, setPriceRange, toggleCategory, setSelectedCollections]);

  // Filter products by selectedCollections
  const visibleProducts =
    selectedCollections.length > 0
      ? products.filter((p) => selectedCollections.includes(p.collection))
      : products;

  // If you want to filter by price only if priceRange is not default:
  const priceFilteredProducts = visibleProducts.filter((p) => {
    const min = priceRange[0];
    const max = priceRange[1];
    // Only filter if max is not the default (e.g., 20000)
    if (min === 0 && (max === 20000 || max === Infinity)) return true;
    return p.price >= min && p.price <= max;
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Determine if any filter is applied
  const isAnyFilterApplied =
    (selectedCategories && selectedCategories.length > 0) ||
    (selectedMaterials && selectedMaterials.length > 0) ||
    (selectedCollections && selectedCollections.length > 0) ||
    showDiscounted ||
    (priceRange && (priceRange[0] !== 0 || priceRange[1] !== Infinity));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <main className="pt-24 pb-16 px-4 md:px-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Overlay for mobile filter sidebar */}
            {isFilterOpen && (
              <div
                className="fixed inset-0 bg-black/30 z-40 md:hidden"
                onClick={() => setIsFilterOpen(false)}
              />
            )}

            {/* Sidebar */}
            <aside
              className={`
                md:block
                ${isFilterOpen ? 'fixed right-0 top-0 h-full w-80 max-w-full bg-background z-50 p-4 shadow-lg transition-transform duration-300' : 'hidden'}
                md:static md:w-auto md:h-auto md:p-0 md:shadow-none
              `}
              style={{ minWidth: isFilterOpen ? '320px' : undefined }}
            >
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

            {/* Open Filters Button for mobile */}
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
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className='flex flex-col justify-center items-center  '><img className='w-20 ' src="https://res.cloudinary.com/dutpxuzpt/image/upload/v1744821089/Spinner_1x-1.1s-200px-200px_topqq2.gif" alt="Your cart is loading " srcset="" />
                  <p className='opacity-[0.5]'>Loading products...</p></div>
                </div>
              ) : (
                <>
                  {isAnyFilterApplied && (
                    <div className="text-xs text-accent flex justify-center items-center mb-4 font-medium">
                      Filters are applied
                    </div>
                  )}
                  <ProductGrid
                    products={
                      filteredProducts.length > 0
                        ? filteredProducts
                        : visibleProducts
                    }
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Products;
