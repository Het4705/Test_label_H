import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp, 
  addDoc, 
  serverTimestamp,
  runTransaction,
  increment
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { 
  User,
  Order, 
  Review, 
  CartItem, 
  Address, 
  OrderStatus, 
  PaymentStatus,
  OrderItem,
  Product,
  Collection
} from "@/types";
import { toast } from "@/hooks/use-toast";

// Collections
const USERS = "users";
const ORDERS = "orders";
const REVIEWS = "reviews";
const CARTS = "carts";
const ADDRESSES = "addresses";
const FAVORITES = "favorites";
const PRODUCTS = "products";
const COLLECTIONS = "collections";

// User Operations
export const createUserProfile = async (
  userId: string, 
  email: string,
  additionalInfo?: {
    displayName?: string;
    phoneNumber?: string;
  }
) => {
  try {
    const userRef = doc(db, USERS, userId);
    const userProfile: User = {
      id: userId,
      email,
      displayName: additionalInfo?.displayName || "",
      phoneNumber: additionalInfo?.phoneNumber || "",
      favorites: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    await setDoc(userRef, userProfile);
    return userProfile;
  } catch (error: any) {
    console.error("Error creating user profile:", error);
    toast({
      title: "Error creating profile",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const userRef = doc(db, USERS, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as User;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error("Error getting user profile:", error);
    toast({
      title: "Error fetching profile",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<User>) => {
  try {
    const userRef = doc(db, USERS, userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    toast({
      title: "Error updating profile",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

// Product Operations
export const getProducts = async () => {
  try {
    console.log("3 Fetching products:");
    const productsQuery = query(
      collection(db, PRODUCTS),
      orderBy("name")
    );
    
    const productsSnap = await getDocs(productsQuery);
    console.log("1 Fetched products:", productsSnap);
    const products: Product[] = [];
    
    productsSnap.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() } as Product);
    });
    console.log("2 Fetched products:", products);
    
    return products;
  } catch (error: any) {
    console.error("Error getting products:", error);
    toast({
      title: "Error fetching products",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const getFeaturedProducts = async () => {
  try {
    const featuredProductsQuery = query(
      collection(db, PRODUCTS),
      where("featuredProduct", "==", true), // 👈 filter where featuredProduct is true
    );
    
    const productsSnap = await getDocs(featuredProductsQuery);
    const featuredProducts: Product[] = [];
    
    productsSnap.forEach(doc => {
      featuredProducts.push({ id: doc.id, ...doc.data() } as Product);
    });
    
    return featuredProducts;
  } catch (error: any) {
    console.error("Error getting featured products:", error);
    toast({
      title: "Error fetching featured products",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const getProductById = async (productId: string) => {
  try {
    const productRef = doc(db, PRODUCTS, productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      return { id: productSnap.id, ...productSnap.data() } as Product;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error("Error getting product:", error);
    toast({
      title: "Error fetching product details",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

// Cart Operations
export const getCart = async (userId: string) => {
  try {
    const cartRef = doc(db, CARTS, userId);
    const cartSnap = await getDoc(cartRef);
    
    if (cartSnap.exists()) {
      return cartSnap.data().items as CartItem[];
    } else {
      return [];
    }
  } catch (error: any) {
    console.error("Error getting cart:", error);
    toast({
      title: "Error fetching cart",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const updateCart = async (userId: string, items: CartItem[]) => {
  try {
    const cartRef = doc(db, CARTS, userId);
    await setDoc(cartRef, { 
      userId,
      items,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error: any) {
    console.error("Error updating cart:", error);
    toast({
      title: "Error updating cart",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const addToCart = async (userId: string, product: Product, quantity: number = 1,size:string,offerPercentage:number) => {
  try {
    const cart = await getCart(userId);
    const existingItem = cart.find(item => item.id === product.id && item.size === size);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.discount ? Math.round(product.price / (1 - product.discount.offerPercentage / 100)) : null,
        image: product.images[0],
        size: size,
        discount: product.discount ? { offerPercentage: product.discount.offerPercentage } : null,
        quantity
      });
    }
    
    await updateCart(userId, cart);
    
    return cart;
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    toast({
      title: "Error adding to cart",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const removeFromCart = async (userId: string, productId: string, size: string) => {
  try {
    const cart = await getCart(userId);
    const updatedCart = cart.filter(item => !(item.id === productId && item.size === size));
    
    await updateCart(userId, updatedCart);
    
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
    
    return updatedCart;
  } catch (error: any) {
    console.error("Error removing from cart:", error);
    toast({
      title: "Error removing from cart",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const updateCartItemQuantity = async (userId: string, productId: string, quantity: number, size: string) => {
  try {
    const cart = await getCart(userId);
    const updatedCart = cart.map(item => 
      item.id === productId && item.size === size
        ? { ...item, quantity: Math.max(1, quantity) } 
        : item
    );
    
    await updateCart(userId, updatedCart);
    return updatedCart;
  } catch (error: any) {
    console.error("Error updating cart item quantity:", error);
    toast({
      title: "Error updating cart",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

// Favorites Operations
export const getFavorites = async (userId: string) => {
  try {
    const userRef = doc(db, USERS, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data().favorites as string[];
    } else {
      return [];
    }
  } catch (error: any) {
    console.error("Error getting favorites:", error);
    toast({
      title: "Error fetching favorites",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const toggleFavorite = async (userId: string, productId: string) => {
  try {
    const favorites = await getFavorites(userId);
    let updatedFavorites: string[];
    let message: string;
    
    if (favorites.includes(productId)) {
      updatedFavorites = favorites.filter(id => id !== productId);
      message = "Removed from favorites";
    } else {
      updatedFavorites = [...favorites, productId];
      message = "Added to favorites";
    }
    
    await updateUserProfile(userId, { favorites: updatedFavorites });
    
    toast({
      title: message,
      description: "Your favorites have been updated.",
    });
    
    return { favorites: updatedFavorites, added: !favorites.includes(productId) };
  } catch (error: any) {
    console.error("Error toggling favorite:", error);
    toast({
      title: "Error updating favorites",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

// Order Operations
export const createOrder = async (
  userId: string, 
  items: CartItem[], 
  shippingAddress: Address,
  billingAddress?: Address
) => {
  try {
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 1500 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + shipping + tax;
    
    // Convert CartItem[] to OrderItem[]
    const orderItems: OrderItem[] = items.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size || "M" // Default size if not provided
    }));
    
    const orderData: Omit<Order, 'id'> = {
      userId,
      items: orderItems,
      subtotal,
      shipping,
      tax,
      total,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: "COD", // Default to Cash on Delivery
      shippingAddress,
      billingAddress:null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const orderRef = await addDoc(collection(db, ORDERS), orderData);
    
    // Clear cart after successful order
    await updateCart(userId, []);
    
    toast({
      title: "Order placed successfully",
      description: `Your order #${orderRef.id.slice(-6)} has been placed.`,
    });
    
    return { id: orderRef.id, ...orderData } as Order;
  } catch (error: any) {
    console.error("Error creating order:", error);
    toast({
      title: "Error placing order",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const clearCartFirestore = async (userId: string) => {
  const cartRef = collection(db, `users/${userId}/cart`);
  const snapshot = await getDocs(cartRef);
  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  return []; // Return empty cart
};

export const getUserOrders = async (userId: string) => {
  try {
    const ordersQuery = query(
      collection(db, ORDERS),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const ordersSnap = await getDocs(ordersQuery);
    const orders: Order[] = [];
    
    ordersSnap.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    
    return orders;
  } catch (error: any) {
    console.error("Error getting user orders:", error);
    toast({
      title: "Error fetching orders",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const orderRef = doc(db, ORDERS, orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      return { id: orderSnap.id, ...orderSnap.data() } as Order;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error("Error getting order:", error);
    toast({
      title: "Error fetching order details",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const submitReview = async (
  userId: string,
  productId: string,
  name: string,
  rating: number,
  comment: string
  ) => {
    try {
    const reviewData = {
      userId,
      productId,
      name,
      rating,
      comment,
      date: new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      createdAt: Timestamp.now(),
      approved: true, // Auto-approve for now
    };
    
    const productRef = doc(db, "products", productId);
    const reviewsRef = collection(db, "reviews");

    let newReviewRef;

    await runTransaction(db, async (transaction) => {
      const productSnap = await transaction.get(productRef);
      const productData = productSnap.data();
      const currentReviewCount = productData?.reviewCount || 0;
      const currentRating = productData?.rating || 0;

      // Calculate new average rating
      const newReviewCount = currentReviewCount + 1;
      const newRating = ((currentRating * currentReviewCount) + rating) / newReviewCount;

      newReviewRef = doc(reviewsRef); // Create doc ref after reads but before write
      transaction.set(newReviewRef, reviewData);

      transaction.update(productRef, {
        reviewCount: newReviewCount,
        rating: Number(newRating.toFixed(2)), // round to 2 decimals
      });
    });

    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    });

    return { id: newReviewRef.id, ...reviewData } as Review;
  } catch (error: any) {
    console.error("Error submitting review:", error);
    toast({
      title: "Error submitting review",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const getProductReviews = async (productId: string) => {
  try {
    const reviewsQuery = query(
      collection(db, REVIEWS),
      where("productId", "==", productId),
      where("approved", "==", true),
      orderBy("createdAt", "desc") 
    );
    
    const reviewsSnap = await getDocs(reviewsQuery);
    const reviews: Review[] = [];
    
    reviewsSnap.forEach(doc => {
      reviews.push({ id: doc.id, ...doc.data() } as Review);
    });
    
    return reviews;
  } catch (error: any) {
    console.error("Error getting product reviews:", error);
    throw error;
  }
};

// Address Operations
export const getUserAddresses = async (userId: string) => {
  try {
    const addressesQuery = query(
      collection(db, ADDRESSES),
      where("userId", "==", userId)
    );
    
    const addressesSnap = await getDocs(addressesQuery);
    const addresses: Address[] = [];
    
    addressesSnap.forEach(doc => {
      addresses.push({ id: doc.id, ...doc.data() } as Address);
    });
    
    return addresses;
  } catch (error: any) {
    console.error("Error getting user addresses:", error);
    toast({
      title: "Error fetching addresses",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const addAddress = async (userId: string, address: Omit<Address, 'id' | 'userId'>) => {
  try {
    const addressData = {
      ...address,
      userId
    };
    
    const addressRef = await addDoc(collection(db, ADDRESSES), addressData);
    
    // If this is set as default, update all other addresses
    if (address.isDefault) {
      const addresses = await getUserAddresses(userId);
      
      for (const addr of addresses) {
        if (addr.id !== addressRef.id && addr.isDefault) {
          await updateAddress(addr.id, { isDefault: false });
        }
      }
    }
    
    toast({
      title: "Address added",
      description: "Your address has been saved.",
    });
    
    return { id: addressRef.id, ...addressData } as Address;
  } catch (error: any) {
    console.error("Error adding address:", error);
    toast({
      title: "Error adding address",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const updateAddress = async (addressId: string, data: Partial<Address>) => {
  try {
    const addressRef = doc(db, ADDRESSES, addressId);
    await updateDoc(addressRef, data);
    
    toast({
      title: "Address updated",
      description: "Your address has been updated.",
    });
    
    return true;
  } catch (error: any) {
    console.error("Error updating address:", error);
    toast({
      title: "Error updating address",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const deleteAddress = async (addressId: string) => {
  try {
    const addressRef = doc(db, ADDRESSES, addressId);
    await deleteDoc(addressRef);
    
    toast({
      title: "Address deleted",
      description: "Your address has been removed.",
    });
    
    return true;
  } catch (error: any) {
    console.error("Error deleting address:", error);
    toast({
      title: "Error deleting address",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

// Collection Operations
export const getCollections = async () => {
  try {
    const collectionsQuery = query(
      collection(db, "collections"),
      orderBy("name")
    );
    
    const collectionsSnap = await getDocs(collectionsQuery);
    const collections: Collection[] = [];
    
    collectionsSnap.forEach(doc => {
      collections.push({ id: doc.id, ...doc.data() } as Collection);
    });
    
    return collections;
  } catch (error: any) {
    console.error("Error getting collections:", error);
    toast({
      title: "Error fetching collections",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const getReels = async () => {
  try {
    const reelsQuery = query(
      collection(db, "reels"),
      orderBy("createdAt", "desc") // or "name" or whatever field you want
    );
    const reelsSnap = await getDocs(reelsQuery);
    const reels: any[] = [];
    reelsSnap.forEach(doc => {
      reels.push({ id: doc.id, ...doc.data() });
    });
    return reels;
  } catch (error: any) {
    console.error("Error getting reels:", error);
    throw error;
  }
};
