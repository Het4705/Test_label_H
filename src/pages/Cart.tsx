import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthDialog } from '@/contexts/AuthDialogContext';
import { useCart } from '@/hooks/use-cart';
import { Address, CartItem } from '@/types';
import { createOrder } from '@/lib/firestore';
import AddressDialog from '@/components/AddressDialog';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { currentUser } = useAuth();
  const { openLogin } = useAuthDialog();
  const { cartItems, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 1500 ? 0 : 99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleCheckout = () => {
    if (!currentUser) {
      openLogin();
    } else {
      setIsAddressDialogOpen(true);
    }
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
    placeOrder(address);
  };

  const placeOrder = async (address: Address) => {
    if (!currentUser || cartItems.length === 0) return;
    
    setIsProcessingOrder(true);
    try {
      const orderRef = await createOrder(currentUser.uid, cartItems, address);
      clearCart();
      toast({
        title: "Order Placed Successfully",
        description: "Thank you for your purchase!",
      });

      // Prepare custom products object
      const products = cartItems.map(item => ({
        name: item.name,
        image: item.image,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
      }));

      // Prepare order object (customize as needed)
      const order = {
        id: orderRef.id,
        shippingAddress: address,
        total: calculateTotal(),
        shipping: calculateShipping(),
        subtotal: calculateSubtotal(),
        date: new Date().toISOString(),
      };

      const user ={
        id: currentUser.uid,
        name: currentUser.displayName,
        email: currentUser.email,
      }
      // Send email API call
      fetch("http://localhost:5000/send-order-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user,
          order,
          products,
        }),
      }).catch(err => {
        // Optionally handle API error (do not block UI)
        console.error("Failed to send order confirmation email:", err);
      });

      setTimeout(() => {
        navigate('/orders'); // Redirect to orders page after successful order
      }, 2000);
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: error.message || "There was an issue placing your order.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <main className="pt-24 pb-16 px-4 md:px-8 flex-grow">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-10 text-center">
            Your <span className="text-accent">Cart</span>
          </h1>
          
          { !loading ? !loading && cartItems.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-playfair mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't adde dany items to your cart yet.
              </p>
              <Link to="/products">
                <Button>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-playfair font-semibold mb-6">Shopping Cart ({cartItems.length} items)</h2>
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-32 h-40 overflow-hidden rounded-md">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="font-playfair text-lg font-semibold">{item.name}  [ <span className="font-semibold text-accent">{item.size}</span> ] </h3>
                            <p className="text-accent font-bold">₹{item.price}</p>
                            
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center border border-border rounded-md overflow-hidden">
                              <button 
                                className="px-3 py-1 hover:bg-muted transition-colors"
                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-1">{item.quantity}</span>
                              <button 
                                className="px-3 py-1 hover:bg-muted transition-colors"
                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <button 
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              onClick={() => removeFromCart(item.id,item.size)}
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-playfair font-semibold mb-6">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{calculateSubtotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{calculateShipping() === 0 ? 'Free' : `₹${calculateShipping()}`}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Taxes calculated at checkout
                    </p>
                    <Button 
                      className="w-full mt-4"
                      onClick={handleCheckout}
                      disabled={isProcessingOrder || loading}
                    >
                      {!currentUser 
                        ? "Sign in to Checkout" 
                        : isProcessingOrder 
                          ? "Processing..." 
                          : "Checkout"
                      } 
                      {!isProcessingOrder && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                    <div className="text-center mt-4">
                      <Link to="/products" className="text-sm text-accent hover:underline">
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ):<div className='flex flex-col justify-center items-center  '><img className='w-20 ' src="https://res.cloudinary.com/dutpxuzpt/image/upload/v1744821089/Spinner_1x-1.1s-200px-200px_topqq2.gif" alt="Your cart is loading " srcset="" /><p className='opacity-[0.5]'>
            Your cart is loading</p> </div>}
        </div>
      </main>
      <Footer isDarkMode={isDarkMode} />
      
      <AddressDialog 
        isOpen={isAddressDialogOpen}
        onClose={() => setIsAddressDialogOpen(false)}
        onSelectAddress={handleSelectAddress}
      />
    </div>
  );
};

export default Cart;
