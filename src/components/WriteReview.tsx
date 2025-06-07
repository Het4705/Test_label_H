
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { submitReview } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';

interface WriteReviewProps {
  productId: string;
  onReviewSubmit?: () => void;
}

const WriteReview = ({ productId, onReviewSubmit }: WriteReviewProps) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }
    
    if (comment.trim().length < 10) {
      toast({
        title: "Error",
        description: "Please write a comment of at least 10 characters",
        variant: "destructive",
      });
      return;
    }
    
    if (name.trim().length < 2) {
      toast({
        title: "Error",
        description: "Please provide your name",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
     
      // Use the submitReview function from firestore.ts
      await submitReview(
        currentUser.providerId || 'anonymous',
        productId,
        name,
        rating,
        comment
      );
      
      // Reset form
      setRating(0);
      setHoveredRating(0);
      setComment('');
      setName('');
      
      // Notify parent component
      if (onReviewSubmit) {
        onReviewSubmit();
      }
      
    } catch (error: any) {
      console.error('Error submitting review:', error);
      let needSignIn=null;
      if(currentUser==null){
         needSignIn="Please Sign in to write a review"
      }
      toast({
        title: "Error",
        description: needSignIn || error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 bg-muted/30 p-6 rounded-lg">
      <h3 className="text-lg font-playfair font-semibold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="rating" className="block text-sm font-medium mb-2">
            Rating
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                <Star 
                  className={`h-6 w-6 ${
                    star <= (hoveredRating || rating) 
                      ? 'fill-accent text-accent' 
                      : 'text-muted-foreground/40'
                  }`} 
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {rating > 0 ? `${rating} of 5 stars` : 'Select a rating'}
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Your Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50 bg-background"
            placeholder="Enter your name"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium mb-2">
            Review
          </label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px] resize-none"
            placeholder="Share your experience with this product..."
          />
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </div>
  );
};

export default WriteReview;
