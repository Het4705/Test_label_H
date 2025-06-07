import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import { getCollections } from '@/lib/firestore';
import type { Collection } from '@/types';

const DEFAULT_MAX_PRICE = Infinity;

const ProductFilters = () => {
  const {
    priceRange,
    setPriceRange,
    selectedCategories,
    toggleCategory,
    selectedMaterials,
    toggleMaterial,
    showDiscounted,
    setShowDiscounted,
    resetFilters,
    applyFilters,
    selectedCollections,
    setSelectedCollections,
  } = useProducts();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Collapsible state for each section
  const [open, setOpen] = useState({
    price: false,
    categories: false,
    materials: false,
    collections: false,
    discounted: false,
  });

  useEffect(() => {
    getCollections().then((data) => setCollections(data));
  }, []);

  // Apply filters automatically when any filter changes
  useEffect(() => {
    applyFilters();
  }, [selectedCategories, selectedMaterials, showDiscounted, selectedCollections, priceRange, applyFilters]);

  const handlePriceSubmit = () => {
    const min = minPrice ? Math.max(0, parseInt(minPrice)) : 0;
    const max = maxPrice ? Math.max(min, parseInt(maxPrice)) : DEFAULT_MAX_PRICE;
    setPriceRange([min, max]);
    applyFilters();
  };

  const handleCollectionToggle = (id: string) => {
    setSelectedCollections((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    resetFilters();
    setMinPrice('');
    setMaxPrice('');
    setPriceRange([0, DEFAULT_MAX_PRICE]);
  };

  const categories = [
    { id: 'Traditional', label: 'Traditional' },
    { id: 'Indo-Western', label: 'Indo-Western' },
    { id: 'Fusion', label: 'Fusion' },
    { id: 'Casual', label: 'Casual' },
    { id: 'Formal', label: 'Formal' },
  ];
  
  const materials = [
    { id: 'Silk', label: 'Silk' },
    { id: 'Cotton', label: 'Cotton' },
    { id: 'Linen', label: 'Linen' },
    { id: 'Georgette', label: 'Georgette' },
    { id: 'Chiffon', label: 'Chiffon' },
  ];

  // Helper for toggling sections
  const toggleSection = (section: keyof typeof open) => {
    setOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-4 sticky top-20 h-[90%] sm:h-auto flex flex-col overflow-auto border-2 p-2 rounded-md bg-background">
      <h2 className="text-xl font-bold mb-2">Filters</h2>

      {/* Price Range */}
      <div>
        <button
          type="button"
          className="flex items-center justify-between w-full text-lg font-medium mb-1"
          onClick={() => toggleSection('price')}
        >
          Price Range {open.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {open.price && (
          <div className="mb-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="min-price" className="text-sm text-muted-foreground">Min</Label>
                <Input
                  id="min-price"
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="max-price" className="text-sm text-muted-foreground">Max</Label>
                <Input
                  id="max-price"
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min={0}
                />
              </div>
            </div>
            <Button
              onClick={handlePriceSubmit}
              variant="secondary"
              size="sm"
              className="w-full mt-2"
            >
              Apply
            </Button>
          </div>
        )}
      </div>
      <Separator />

      {/* Categories */}
      <div>
        <button
          type="button"
          className="flex items-center justify-between w-full text-lg font-medium mb-1"
          onClick={() => toggleSection('categories')}
        >
          Categories {open.categories ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {open.categories && (
          <div className="space-y-2 mb-2">
            {categories.map(category => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="text-sm cursor-pointer"
                >
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>
      <Separator />

      {/* Materials */}
      <div>
        <button
          type="button"
          className="flex items-center justify-between w-full text-lg font-medium mb-1"
          onClick={() => toggleSection('materials')}
        >
          Materials {open.materials ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {open.materials && (
          <div className="space-y-2 mb-2">
            {materials.map(material => (
              <div key={material.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`material-${material.id}`}
                  checked={selectedMaterials.includes(material.id)}
                  onCheckedChange={() => toggleMaterial(material.id)}
                />
                <Label
                  htmlFor={`material-${material.id}`}
                  className="text-sm cursor-pointer"
                >
                  {material.label}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>
      <Separator />

      {/* Collections */}
      <div>
        <button
          type="button"
          className="flex items-center justify-between w-full text-lg font-medium mb-1"
          onClick={() => toggleSection('collections')}
        >
          Collections {open.collections ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {open.collections && (
          <div className="space-y-2 mb-2">
            {collections.length === 0 && (
              <span className="text-xs text-muted-foreground">Loading...</span>
            )}
            {collections.map(collection => (
              <div key={collection.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`collection-${collection.id}`}
                  checked={selectedCollections.includes(collection.id)}
                  onCheckedChange={() => handleCollectionToggle(collection.id)}
                />
                <Label
                  htmlFor={`collection-${collection.id}`}
                  className="text-sm cursor-pointer"
                >
                  {collection.name}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>
      <Separator />

      {/* Discounted */}
      <div>
        <button
          type="button"
          className="flex items-center justify-between w-full text-lg font-medium mb-1"
          onClick={() => toggleSection('discounted')}
        >
          Discounted {open.discounted ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {open.discounted && (
          <div className="flex items-center space-x-2 mb-2">
            <Checkbox
              id="discount"
              checked={showDiscounted}
              onCheckedChange={() => setShowDiscounted(!showDiscounted)}
            />
            <Label htmlFor="discount" className="cursor-pointer">Show discounted items</Label>
          </div>
        )}
      </div>

      <Button
        variant="outline"
        className="w-full border-accent text-accent hover:bg-accent/10 mt-2"
        onClick={handleResetFilters}
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default ProductFilters;
