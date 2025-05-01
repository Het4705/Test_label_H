
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/use-favorites';
import { useCart } from '@/hooks/use-cart';
import { toast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Timestamp } from 'firebase/firestore';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

const ProductCard = ({ product, featured = false }: ProductCardProps) => {
   const { currentUser } = useAuth();
   const [discountedPrice,setDiscountedPrice]=useState(null);
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  
  const isFavorite = favoriteIds.includes(product.id);
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wishlist",
        variant: "destructive",
      });
      return;
    }
    
    toggleFavorite(product.id);
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      return;
    }
    
    addToCart(product, 1);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
  useEffect(() => {
    const today = new Date();
  
    // Convert Firebase Timestamp to JS Date
    const validUntil = (product.discount.validDate as Timestamp).toDate();
  
    if (today < validUntil) {
      const discounted = product.price - (product.discount.offerPercentage / 100) * product.price;
      setDiscountedPrice(discounted);
    } else {
      setDiscountedPrice(null);
    }
  }, [product]);
  

  if (featured) {
    return (
      <div className="group relative h-full">
        <Link to={`/product/${product.id}`} className="block h-full">
          <div className="bg-muted/30 rounded-xl overflow-hidden h-full flex flex-col">
            <div className="relative pt-[125%] overflow-hidden">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {product.discount && (
                <span className="absolute top-2 left-2 bg-destructive text-white text-xs font-bold px-2 py-1 rounded">
                  {product.discount.offerPercentage}% OFF
                </span>
              )}
              
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-white hover:bg-white/90 text-primary"
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag className="mr-1 h-4 w-4" /> Add to Cart
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{product.name}</h3>
                  <button 
                    onClick={handleToggleFavorite}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    className="text-muted-foreground hover:text-accent ml-1"
                  >
                    <Heart className={`h-[18px] w-[18px] ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>
                <div className="flex items-center mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 ${i < product.rating ? 'fill-accent text-accent' : 'text-muted-foreground/40'}`} 
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">
                    ({product.reviewCount})
                  </span>
                </div>
              </div>
              
              <div className="mt-2">
                <div className="flex items-center">
                  <span className="font-semibold text-accent">₹{product.price}</span>
                  {discountedPrice && (
                    <span className="ml-2 text-sm text-muted-foreground line-through">
                      ₹{discountedPrice}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{product.material}</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="bg-muted/30 rounded-lg overflow-hidden">
          <div className="relative aspect-square overflow-hidden">
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {discountedPrice && (
              <span className="absolute top-2 left-2 bg-destructive text-white text-xs font-bold px-2 py-1 rounded">
                {discountedPrice}% OFF
              </span>
            )}
            
            <button 
              onClick={handleToggleFavorite}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className="absolute top-2 right-2 h-8 w-8 bg-background/80 rounded-full flex items-center justify-center text-muted-foreground hover:text-accent"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            
            <div className="absolute bottom-0 w-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="default" 
                size="sm"
                className="w-full" 
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-1 h-4 w-4" /> Add to Cart
              </Button>
            </div>
          </div>
          
          <div className="p-3">
            <h3 className="font-medium truncate">{product.name}</h3>
            <div className="flex items-center mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${i < product.rating ? 'fill-accent text-accent' : 'text-muted-foreground/40'}`} 
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">
                ({product.reviewCount})
              </span>
            </div>
            <div className="flex items-center mt-2">
              <span className="font-semibold text-accent">₹{product.price}</span>
              {discountedPrice && (
                <span className="ml-2 text-sm text-muted-foreground line-through">
                  ₹{discountedPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
