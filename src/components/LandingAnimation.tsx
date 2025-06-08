
import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const LandingAnimation = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br 
    my-20
    from-background to-background/50">
      <div className={`label-h-animation h-[90vh]
      flex flex-col justify-center ${show ? 'opacity-100' : 'opacity-0'} text-center`}>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-playfair font-bold">
          <span className="text-foreground">The</span>
          <br />
          <span className="text-accent">Label H</span>
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-foreground/70">Elegance Redefined</p>
      </div>

      {/* Banner image below the title */}
      <div className="w-full max-w-5xl mx-auto mt-12 overflow-hidden rounded-lg">
        <img 
          src="https://images.unsplash.com/photo-1603189863862-f6f7724257b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80" 
          alt="The Label H Collection" 
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Video Section */}
      {/* <div className="w-full max-w-5xl mx-auto mt-24 mb-16">
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-12">
          Our <span className="text-accent">Story</span>
        </h2>
         */}
        {/* <div className="relative aspect-video rounded-lg overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1564419434663-c49967363669?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80" 
            alt="Brand story video thumbnail" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="icon"
                  variant="outline"
                  className="h-16 w-16 rounded-full bg-white/80 hover:bg-white dark:bg-black/50 dark:hover:bg-black/70 border-0 transition-transform group-hover:scale-110"
                >
                  <Play className="h-8 w-8 text-accent fill-accent" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <div className="aspect-video">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://youtu.be/zY3atcmLBag?si=qzphKEDEYrC4wTUe" 
                    title="Brand Story" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6">
            <h3 className="text-white text-xl md:text-2xl font-playfair font-bold">The Journey of Label H</h3>
            <p className="text-white/80 mt-2">Watch the story behind our brand and our commitment to craftsmanship</p>
          </div>
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default LandingAnimation;
