
import { useState } from 'react';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const [visibleProducts, setVisibleProducts] = useState(8);
  const isMobile = useIsMobile();
  
  const loadMore = () => {
    setVisibleProducts(prev => Math.min(prev + 4, products.length));
  };

  return (
    <div>
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl font-medium mb-4">No products match your filters</p>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters to find products you're looking for.
          </p>
        </div>
      ) : (
        <>
          <div className={`grid grid-cols-2 ${isMobile ? 'gap-3' : 'sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6'}`}>
            {products.slice(0, visibleProducts).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {visibleProducts < products.length && (
            <div className="flex justify-center mt-12">
              <Button 
                variant="outline" 
                className="border-accent text-accent hover:bg-accent hover:text-white"
                onClick={loadMore}
              >
                Load More <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductGrid;
