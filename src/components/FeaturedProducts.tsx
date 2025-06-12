import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Product } from '../types/index';
import { getFeaturedProducts } from "../lib/firestore";
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const FeaturedProducts = () => {
  const [showProducts, setShowProducts] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();  // Initialize the navigate function

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProducts(true);
    }, 500);

    const fetchFeaturedProducts = async () => {
      try {
        const featured = await getFeaturedProducts();
        setProducts(featured);
      } catch (error) {
        console.error("Failed to fetch featured products", error);
      }
    };

    fetchFeaturedProducts();

    return () => clearTimeout(timer);
  }, []);

  // Handle navigation on click
  const handleProductClick = (productId: string) => {
    // Use navigate to go to the product page without reloading
    navigate(`/product/${productId}`);
  };

  return (   
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold">
            <span className="text-accent">Featured</span> Collection
          </h2>
          <Button variant="ghost" className="gap-2" onClick={() => navigate('/products')}>
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className={`glass-card group overflow-hidden transition-all duration-500 hover:shadow-2xl ${
                showProducts ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${150}ms` }}
              onClick={() => handleProductClick(product.id)} // Handle the click event for navigation
            >
              <div className="relative overflow-hidden h-80">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-playfair text-lg font-semibold">{product.name}</h3>
                <p className="text-foreground/70">₹{(product.price - ((product.price / 100) * product?.discount?.offerPercentage)).toFixed(1)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
