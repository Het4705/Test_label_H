import { marked } from "marked";
import { Button } from "@/components/ui/button";
import { Collection } from "@/types";
import { getCollections } from "@/lib/firestore"; // Add this function to fetch collections
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CollectionShowcase = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCollections, setShowCollections] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCollections(true);
    }, 500);

    const fetchCollections = async () => {
      try {
        const data = await getCollections();
        setCollections(data);
      } catch (error) {
        console.error("Failed to fetch collections", error);
      }
    };

    fetchCollections();

    return () => clearTimeout(timer);
  }, []);

  const handleExploreCollection = (collectionId: string) => {
    navigate(`/products?collection=${collectionId}`);
  };

  return (
    <section className="py-16 px-4 md:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-playfair font-bold mb-12">
          Explore <span className="text-accent">By collection</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="relative overflow-hidden rounded-lg h-[400px] group"
            >
              <img
                src={collection.image}
                alt={collection.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${collection.color} to-transparent opacity-80`}
              ></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="font-playfair text-2xl font-bold mb-2">
                  {collection.name}
                </h3>
                <p
                  className="mb-4 opacity-90"
                  dangerouslySetInnerHTML={{
                    __html: marked(collection.description.slice(0, 100)),
                  }}
                ></p>
                <Button onClick={()=>handleExploreCollection(collection.id)}
                  variant="outline"
                  className="w-full sm:w-auto border-white text-black dark:text-white hover:opacity-90 hover:text-black transition-colors"
                >
                  Explore Collection
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionShowcase;
