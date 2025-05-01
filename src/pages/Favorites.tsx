
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/use-favorites';
import { Product } from '@/types';
import { getProducts } from '@/lib/firestore';

const Favorites = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const { getFavoriteProducts, favoriteIds, loading: favoritesLoading } = useFavorites();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await getProducts();
        setAllProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const favoriteProducts = getFavoriteProducts(allProducts);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <main className="pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-playfair font-bold flex items-center">
            My <span className="text-accent mx-2">Favorites</span> 
            <Heart className="h-6 w-6 text-accent fill-accent ml-2" />
          </h1>
        </div>

        {loading || favoritesLoading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Loading favorites...</p>
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-playfair mb-4">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't added any items to your favorites yet.
            </p>
            <Link to="/products">
              <Button className="bg-accent hover:bg-accent/90">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {favoriteProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <footer className="bg-muted py-8 px-4 text-center text-foreground/70">
        <p>© {new Date().getFullYear()} The Label H. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Favorites;
