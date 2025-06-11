import { Timestamp as FirestoreTimestamp } from 'firebase/firestore';

// Export Timestamp type for use throughout the application
export type Timestamp = FirestoreTimestamp | Date | { seconds: number; nanoseconds: number };

export type User = {
  id: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  addresses?: Address[];
  favorites: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  UNISEX = "unisex"
}

export type Product = {
  id: string;
  name: string;
  price: number;
  images: string[]; // Changed from single image to array of images
  featuredProduct?: boolean; // Added featured product flag
  videoUrl?: string; // Added video URL field
  category: string;
  description: string;
  rating: number;
  reviewCount: number;
  material: string;
  stock: number;
  collectionId?: string; // Changed from array to single string
  gender: Gender; // Added gender/sex field
  discount?: {
    offerPercentage: number;
    validDate: Timestamp;
  };
  size: {
    length:string,
    available:boolean
  }[];
  reviews?: Review[];
};

export type Collection = {
  id: string;
  name: string;
  image: string;
  description: string;
  items: number;
  color: string;
};

export type Address = {
  id: string;
  userId: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  phoneNumber?: string;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress?: Address;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  trackingNumber?: string;
  customization?: string; // Custom size/details
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  customization?:string;
};

export type Review = {
  id: string;
  productId: string;
  userId: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  createdAt: Timestamp;
  approved: boolean;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: string;
  quantity: number;
  discount?: {
    offerPercentage: number;
  };
  customization?: string; // Custom size/details
};

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  RETURNED = "returned",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export type AnalyticsData = {
  totalSales: number;
  activeUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  topProducts: {
    name: string;
    sales: number;
  }[];
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
  orderStatusCounts: {
    status: string;
    count: number;
  }[];
};

export type Reel = {
  id: string
  src: string
  title: string
  description: string
  price?: string
  thumbnail?: string
  productId: string
}