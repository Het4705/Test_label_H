export interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviewCount: number;
  material: string;
  size?: string;
  reviews?: Review[];
}