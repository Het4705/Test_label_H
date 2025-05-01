
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1000&q=80" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30 dark:opacity-20"
        />
        <div className="absolute inset-0 bg-background/70 dark:bg-background/90"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
          Subscribe for <span className="text-accent">Exclusive</span> Updates
        </h2>
        <p className="max-w-2xl mx-auto text-lg mb-8 text-foreground/80">
          Join our newsletter to receive updates on new collections, special offers, and styling tips from The Label H.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-accent flex-grow"
          />
          <Button className="px-6">Subscribe</Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
