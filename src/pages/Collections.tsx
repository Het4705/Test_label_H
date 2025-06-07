import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Collection } from "@/types";
import { getCollections } from "@/lib/firestore";
import { marked } from "marked";

const Collections = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Updated state to use object instead of array
  const [moreInfo, setMoreInfo] = useState<{ [id: string]: boolean }>({});

  const setShowMore = (id: string) => {
    setMoreInfo((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const {
    data: collections,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["collections"],
    queryFn: getCollections,
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleExploreCollection = (collectionId: string) => {
    navigate(`/products?collection=${collectionId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <main className="pt-24 pb-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className="bg-card rounded-xl overflow-hidden shadow-sm"
              >
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-6">
                  <Skeleton className="h-8 w-2/3 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </main>
        <footer className="bg-muted py-8 px-4 text-center text-foreground/70">
          <p>© {new Date().getFullYear()} The Label H. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <main className="pt-24 pb-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Error loading collections
            </h2>
            <p className="text-muted-foreground">Please try again later.</p>
          </div>
        </main>
        <footer className="bg-muted py-8 px-4 text-center text-foreground/70">
          <p>© {new Date().getFullYear()} The Label H. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <main className="pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-center">
            Our <span className="text-accent">Collections</span>
          </h1>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Explore our carefully curated collections, each telling a unique
            story of craftsmanship, heritage, and contemporary design. Find
            pieces that resonate with your personal style.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {collections?.map((collection: Collection) => (
              <div
                key={collection.id}
                className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col h-full"
              >
                {/* Image with Gradient Overlay */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${collection.color} to-transparent opacity-70`}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="font-playfair text-2xl md:text-3xl font-bold">
                      {collection.name}
                    </h2>
                    <p className="text-white/80 mt-1">
                      {collection.items} items
                    </p>
                  </div>
                </div>

                {/* Description and Button */}
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-muted-foreground mb-4 flex-grow">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(
                          moreInfo[collection.id]
                            ? collection.description
                            : collection.description.slice(0, 100)
                        ),
                      }}
                    />
                    <button
                      onClick={() => setShowMore(collection.id)}
                      className="ml-2 text-accent underline"
                    >
                      show {moreInfo[collection.id] ? "less" : "more"}
                    </button>
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-accent text-accent bg-transparent hover:bg-accent hover:text-white transition-colors"
                    onClick={() => handleExploreCollection(collection.id)}
                  >
                    Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="bg-muted py-8 px-4 text-center text-foreground/70">
        <p>© {new Date().getFullYear()} The Label H. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Collections;
