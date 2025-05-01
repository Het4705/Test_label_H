
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useProducts } from '@/contexts/ProductContext';

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
    applyFilters
  } = useProducts();
  
  const [minPrice, setMinPrice] = useState<string>(priceRange[0].toString());
  const [maxPrice, setMaxPrice] = useState<string>(priceRange[1].toString());
  
  // Apply filters automatically when any filter changes
  useEffect(() => {
    applyFilters();
  }, [selectedCategories, selectedMaterials, showDiscounted, applyFilters]);
  
  const handlePriceSubmit = () => {
    const min = Math.max(0, parseInt(minPrice) || 0);
    const max = Math.max(min, parseInt(maxPrice) || 5000);
    setPriceRange([min, max]);
    applyFilters();
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

  return (
    <div className="space-y-6 sticky top-20">
      <div>
        <h3 className="text-lg font-medium mb-3">Price Range</h3>
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
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-3">Categories</h3>
        <div className="space-y-2">
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
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-3">Materials</h3>
        <div className="space-y-2">
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
      </div>
      
      <Separator />
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="discount" 
          checked={showDiscounted}
          onCheckedChange={() => setShowDiscounted(!showDiscounted)}
        />
        <Label htmlFor="discount" className="cursor-pointer">Show discounted items</Label>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full border-accent text-accent hover:bg-accent/10"
        onClick={resetFilters}
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default ProductFilters;
