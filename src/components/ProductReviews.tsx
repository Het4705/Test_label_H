
import { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getProductReviews } from '@/lib/firestore';
import { Review } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {


    const fetchReviews = async () => {
      try {
        setLoading(true);
        const productReviews = await getProductReviews(productId);
        setReviews(productReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className="mt-6 space-y-6">
        <h3 className="text-xl font-playfair font-semibold mb-4">Customer Reviews</h3>
        <Separator className="mb-4" />
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-16 w-full" />
            {idx < 2 && <Separator className="mt-4" />}
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return <div className="mt-6 text-center text-muted-foreground">No reviews yet</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-playfair font-semibold mb-4">Customer Reviews</h3>
      <Separator className="mb-4" />
      <div className="space-y-6">
        {reviews.map((review, idx) => (
          <div key={review.id || idx} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-muted rounded-full p-2">
                  <User className="h-4 w-4" />
                </div>
                <span className="font-medium">{review.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{review.date}</span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground/40'}`} 
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{review.comment}</p>
            {idx < reviews.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
