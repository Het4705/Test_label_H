
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ShoppingCart, Heart, Sun, Moon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserAvatar from './UserAvatar';

const Navbar = ({ toggleTheme, isDarkMode }: { toggleTheme: () => void; isDarkMode: boolean }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden mr-2" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/" className="flex items-center">
              <span className="font-playfair text-lg font-bold text-foreground sm:text-2xl">The Label H</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            <NavLinks />
          </div>

          <div className="flex items-center  ml-2  sm:mr-0 sm:scale-100  ">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {isDarkMode ? <Sun /> : <Moon />}
            </Button>
            <Link to="/favorites">
              <Button variant="ghost" size="icon" aria-label="Favorites">
                <Heart />
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" aria-label="Shopping cart">
                <ShoppingCart />
              </Button>
            </Link>
            <UserAvatar />
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden py-3 border-t border-border/40">
            <NavLinks mobile={true} />
          </div>
        )}
      </div>
    </nav>
  );
};

// Extract NavLinks to a separate component for reuse
const NavLinks = ({ mobile = false }: { mobile?: boolean }) => {
  const linkClass = mobile
    ? "block w-full py-2 text-foreground/80 hover:text-accent transition-colors"
    : "text-foreground/80 hover:text-accent transition-colors";

  return (
    <div className={mobile ? "flex flex-col space-y-1" : "flex space-x-8"}>
      <Link to="/" className={linkClass}>Home</Link>
      <Link to="/products" className={linkClass}>Shop</Link>
      <Link to="/collections" className={linkClass}>Collections</Link>
      <Link to="/about" className={linkClass}>About</Link>
      <Link to="/contact" className={linkClass}>Contact</Link>
      <Link to="/orders" className={linkClass}>Orders</Link>
    </div>
  );
};

export default Navbar;
