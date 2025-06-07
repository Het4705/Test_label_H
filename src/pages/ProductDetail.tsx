import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  ShoppingBag,
  Heart,
  Star,
  Share2,
  ChevronRight,
  Play,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Info,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import ProductReviews from "../components/ProductReviews";
import WriteReview from "../components/WriteReview";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { Product } from "@/types";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/contexts/AuthContext";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productDoc = await getDoc(doc(db, "products", id as string));

        if (productDoc.exists()) {
          const productData = {
            ...productDoc.data(),
            id: productDoc.id,
          } as Product;

          setProduct(productData);
          fetchSimilarProducts(productData.category, productData.collectionId);
        } else {
          toast({
            title: "Product not found",
            description: "The product you're looking for doesn't exist.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: "Failed to load product details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchSimilarProducts = async (
      category: string,
      collectionName: string
    ) => {
      try {
        const similarProductsQuery = await getDocs(
          query(
            collection(db, "products"),
            where("category", "in", [category, collectionName]), // pseudo-OR
            limit(10)
          )
        );

        const similarProductsList = similarProductsQuery.docs
          .map(
            (doc) =>
              ({
                ...doc.data(),
                id: doc.id,
              } as Product)
          )
          .filter((p) => p.id !== id)
          .slice(0, 4);

        setSimilarProducts(similarProductsList);
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <main className="pt-24 pb-16 px-4 md:px-8 flex-grow">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
              <div className="space-y-4">
                <Skeleton className="aspect-square rounded-lg" />
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <Skeleton key={idx} className="aspect-square rounded-md" />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-24 w-full" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-6 w-full" />
                  ))}
                </div>
                <Separator />
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <div className="flex gap-4">
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-12 w-12" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <div className="pt-24 pb-16 px-4 text-center">
          <h1 className="text-3xl font-playfair font-bold mb-4">
            Product Not Found
          </h1>
          <p className="mb-6">
            Sorry, the product you're looking for doesn't exist.
          </p>
          <Link to="/products">
            <Button>Return to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : [
          "https://images.unsplash.com/photo-1603189863862-f6f7724257b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80",
          "https://images.unsplash.com/photo-1614521084980-811d04f33091?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80",
          "https://images.unsplash.com/photo-1603189863862-f6f7724257b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80",
        ];

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    debugger;
    if (product.size && product.size.length > 0 && !selectedSize) {
      toast({
        title: "Select Size",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      return;
    }
    // Check available quantity (assume product.quantity is available)
    const availableQty = product.stock;
    if (quantity > availableQty) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${availableQty} item(s) available in stock.`,
        variant: "destructive",
      });
      return;
    }
    addToCart(product, quantity, selectedSize);
    toast({
      title: "Added to Cart",
      description: `${quantity} × ${product.name}${
        selectedSize ? ` (${selectedSize})` : ""
      } added to your cart`,
    });
  };

  const handleBuyNow = () => {
    toast({
      title: "Processing",
      description: "Redirecting to checkout...",
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from Wishlist" : "Added to Wishlist",
      description: isFavorite
        ? `${product.name} removed from your wishlist`
        : `${product.name} added to your wishlist`,
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: product?.name,
      text: product?.description,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error
      }
    } else {
      setShowShareOptions(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Product link copied to clipboard.",
    });
    setShowShareOptions(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <main className="pt-24 pb-16 px-4 md:px-8 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center text-sm text-muted-foreground mb-6 flex-wrap">
            <Link to="/" className="hover:text-accent">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link to="/products" className="hover:text-accent">
              Products
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link to={`/collections`} className="hover:text-accent">
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
            <div className="space-y-4">
              <div className="aspect-square bg-muted/30 rounded-lg overflow-hidden">
                <img
                  src={productImages[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-square bg-muted/30 rounded-md overflow-hidden border-2 ${
                      index === currentImageIndex
                        ? "border-accent"
                        : "border-transparent"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="relative aspect-video bg-muted/30 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.youtube.com/embed/19MZu5fZ2T8"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-playfair font-bold mb-2">
                {product.name}
              </h1>

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < product.rating
                        ? "fill-accent text-accent"
                        : "text-muted-foreground/40"
                    }`}
                  />
                ))}
                <span className="text-sm ml-2 text-muted-foreground">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold">₹{product.price}</span>
                {product.discount && (
                  <>
                    <span className="ml-3 text-lg text-muted-foreground line-through">
                      ₹
                      {Math.round(
                        product.price /
                          (1 - product.discount.offerPercentage / 100)
                      )}
                    </span>
                    <span className="ml-2 text-sm text-destructive font-semibold">
                      ({product.discount.offerPercentage}% OFF)
                    </span>
                  </>
                )}
              </div>

              <p className="text-muted-foreground mb-6">
                {product.description}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <span className="w-32 text-sm text-muted-foreground">
                    Category:
                  </span>
                  <span>{product.category}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 text-sm text-muted-foreground">
                    Material:
                  </span>
                  <span>{product.material}</span>
                </div>
                {product.size && product.size.length > 0 && (
                  <div className="flex items-center">
                    <span className="w-32 text-sm text-muted-foreground">
                      Size:
                    </span>
                    <div className="flex gap-2">
                      {product.size.map((size) => (
                        <button
                          key={size.length}
                          type="button"
                          disabled={!size.available}
                          onClick={() =>
                            size.available && setSelectedSize(size.length)
                          }
                          className={`px-3 py-1 rounded border text-sm
                            ${
                              !size.available
                                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                                : ""
                            }
                            ${
                              selectedSize === size.length
                                ? "border-accent bg-accent/10"
                                : "border-border bg-background"
                            }
                          `}
                        >
                          {size.length}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center">
                  <span className="w-32 text-sm text-muted-foreground">
                    Availability:
                  </span>
                  <span
                    className={
                      product.stock > 0
                        ? "text-green-600 dark:text-green-400 font-medium"
                        : "text-red-600 dark:text-red-400 font-medium"
                    }
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-muted-foreground">Quantity:</span>
                <div className="flex items-center border border-border rounded-md overflow-hidden">
                  <button
                    className="px-3 py-2 hover:bg-muted transition-colors"
                    onClick={() => handleQuantityChange(-1)}
                    aria-label="Decrease quantity"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center py-2">{quantity}</span>
                  <button
                    className="px-3 py-2 hover:bg-muted transition-colors"
                    onClick={() => handleQuantityChange(1)}
                    aria-label="Increase quantity"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <Button
                  size="lg"
                  className="flex-1 min-w-[150px]"
                  onClick={handleAddToCart}
                  disabled={
                    product.stock < 1 || ( product.size && product.size.length > 0 && !selectedSize )
                  }
                >
                  <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
                {/* <Button
                  size="lg"
                  variant="secondary"
                  className="flex-1 min-w-[150px]"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button> */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`h-12 w-12 ${
                          isFavorite ? "text-red-500" : ""
                        }`}
                        onClick={toggleFavorite}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isFavorite ? "fill-red-500" : ""
                          }`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add to Wishlist</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12"
                        onClick={handleShare}
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share Product</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 flex items-start space-x-3">
                <Info className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Free shipping</span> on orders
                    over ₹1500
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Return policy: 7 days easy return
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="details" className="mb-16">
            <TabsList className="w-full md:w-auto overflow-x-auto flex max-w-full md:justify-start">
              <TabsTrigger
                value="details"
                className="whitespace-nowrap text-xs md:text-sm"
              >
                Product Details
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="whitespace-nowrap text-xs md:text-sm"
              >
                Reviews ({product.reviewCount})
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="whitespace-nowrap text-xs md:text-sm"
              >
                Shipping & Returns
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-xl font-playfair font-semibold mb-4">
                    Description
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {product.description} Our designs are crafted with utmost
                    attention to detail and quality materials to ensure that
                    each piece is not just beautiful, but also durable and
                    comfortable to wear.
                  </p>
                  <p className="text-muted-foreground">
                    This {product.name.toLowerCase()} is a versatile addition to
                    your wardrobe, perfect for special occasions and
                    celebrations. The intricate detailing and premium fabric
                    make it a standout piece that will draw compliments.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-playfair font-semibold mb-4">
                    Features
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-accent mr-2 shrink-0" />
                      <span>
                        Handcrafted with premium{" "}
                        {product.material.toLowerCase()}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-accent mr-2 shrink-0" />
                      <span>Intricate detailing and embellishments</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-accent mr-2 shrink-0" />
                      <span>Comfortable fit for all-day wear</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-accent mr-2 shrink-0" />
                      <span>Ethically produced by skilled artisans</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-accent mr-2 shrink-0" />
                      <span>Versatile styling options</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-6">
              <ProductReviews productId={product.id} />

              {!showReviewForm ? (
                <Button
                  variant="outline"
                  onClick={() => setShowReviewForm(true)}
                  className="mt-6"
                >
                  Write a Review
                </Button>
              ) : (
                <WriteReview
                  productId={product.id}
                  onReviewSubmit={() => setShowReviewForm(false)}
                />
              )}
            </TabsContent>

            <TabsContent value="shipping" className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-playfair font-semibold mb-3">
                    Shipping Information
                  </h3>
                  <p className="text-muted-foreground">
                    We ship to all major cities across India. Orders are
                    processed within 24-48 hours and shipped via our trusted
                    courier partners. Shipping times vary depending on your
                    location:
                  </p>
                  <ul className="mt-3 space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-accent mr-2 shrink-0" />
                      <span>Metro Cities: 2-3 business days</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-accent mr-2 shrink-0" />
                      <span>Tier 2 Cities: 3-4 business days</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-accent mr-2 shrink-0" />
                      <span>Other Areas: 4-6 business days</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-playfair font-semibold mb-3">
                    Return Policy
                  </h3>
                  <p className="text-muted-foreground">
                    We offer a 7-day return policy for all our products. If
                    you're not satisfied with your purchase, you can return it
                    within 7 days of delivery under the following conditions:
                  </p>
                  <ul className="mt-3 space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-accent mr-2 shrink-0" />
                      <span>
                        The product must be unworn, unwashed, and undamaged
                      </span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-accent mr-2 shrink-0" />
                      <span>Original tags must be attached</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-accent mr-2 shrink-0" />
                      <span>
                        The product must be returned in its original packaging
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Similar Products Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-playfair font-semibold mb-6">
              Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts && similarProducts.length > 0
                ? similarProducts.map((relatedProduct) => (
                    <Link
                      to={`/product/${relatedProduct.id}`}
                      key={relatedProduct.id}
                      className="group"
                    >
                      <div className="rounded-lg overflow-hidden bg-muted/30">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={
                              relatedProduct.images &&
                              relatedProduct.images.length > 0
                                ? relatedProduct.images[0]
                                : "https://via.placeholder.com/300"
                            }
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium truncate">
                            {relatedProduct.name}
                          </h3>
                          <p className="text-accent font-semibold">
                            ₹{relatedProduct.price}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                : Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-lg overflow-hidden bg-muted/30"
                    >
                      <Skeleton className="aspect-square" />
                      <div className="p-3 space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-1/2" />
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </main>
      <Footer isDarkMode={isDarkMode} />
      {/* Share Options Dropdown/Modal */}
      {showShareOptions && (
        <div
          ref={shareRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setShowShareOptions(false)}
        >
          <div
            className="bg-white border rounded shadow-lg p-3 min-w-[180px]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              <button
                className="text-left hover:bg-muted px-2 py-1 rounded"
                onClick={handleCopyLink}
              >
                Copy Link
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  product?.name + " - " + window.location.href
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-muted px-2 py-1 rounded"
                onClick={() => setShowShareOptions(false)}
              >
                Share on WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  window.location.href
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-muted px-2 py-1 rounded"
                onClick={() => setShowShareOptions(false)}
              >
                Share on Facebook
              </a>
              <button
                className="text-left text-red-500 hover:bg-muted px-2 py-1 rounded"
                onClick={() => setShowShareOptions(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
