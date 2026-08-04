"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { GearCard } from "@/components/gear/gear-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { gearApi } from "@/lib/api-service";
import type { Category } from "@/lib/types";

export default function GearBrowsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [brandQuery, setBrandQuery] = React.useState("");
  const [priceRange, setPriceRange] = React.useState({ min: "", max: "" });
  const [rentalDates, setRentalDates] = React.useState({ start: "", end: "" });
  const [availableOnly, setAvailableOnly] = React.useState(true);
  const [sortBy, setSortBy] = React.useState("featured");
  
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  React.useEffect(() => {
    setSearchQuery(q);
    setSelectedCategory(category);
  }, [q, category]);

  // Debounce the text inputs so we don't fire a network request on every
  // keystroke — only after the user pauses typing for 350ms.
  const [debouncedSearch, setDebouncedSearch] = React.useState(searchQuery);
  const [debouncedBrand, setDebouncedBrand] = React.useState(brandQuery);

  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(id);
  }, [searchQuery]);

  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedBrand(brandQuery), 350);
    return () => clearTimeout(id);
  }, [brandQuery]);

  // Fetch gear with filters
  const { data: gear = [], isLoading, error } = useQuery({
    queryKey: ["gear", debouncedSearch, selectedCategory, debouncedBrand, availableOnly],
    queryFn: () => gearApi.getAll({
      search: debouncedSearch || undefined,
      category: selectedCategory || undefined,
      brand: debouncedBrand || undefined,
    }),
    // Keep showing the previous result set while the new one loads instead
    // of unmounting the grid and flashing a full skeleton on every filter
    // change — this is what makes filtering *feel* slow even when the
    // network call itself is fast.
    placeholderData: (previousData) => previousData,
  });

  // Fetch categories — cache them for a long time, they rarely change.
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => gearApi.getCategories(),
    staleTime: 5 * 60_000,
  });

  // Client-side filtering for price range and availability
  const filtered = gear.filter((g) => {
    if (selectedCategory) {
      const categorySlug = g.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      if (g.categoryId !== selectedCategory && categorySlug !== selectedCategory) return false;
    }
    if (brandQuery && !g.brand.toLowerCase().includes(brandQuery.toLowerCase())) return false;
    if (availableOnly && !g.available) return false;
    if (priceRange.min && g.pricePerDay < parseInt(priceRange.min) * 100) return false;
    if (priceRange.max && g.pricePerDay > parseInt(priceRange.max) * 100) return false;
    if (rentalDates.start && rentalDates.end && rentalDates.start >= rentalDates.end) return false;
    return true;
  });

  // Apply sort — "featured" keeps the API's natural order, the rest sort a copy.
  const sorted = React.useMemo(() => {
    const list = [...filtered];
    switch (sortBy) {
      case "price-low":
        return list.sort((a, b) => a.pricePerDay - b.pricePerDay);
      case "price-high":
        return list.sort((a, b) => b.pricePerDay - a.pricePerDay);
      case "rating":
        return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      default:
        return list;
    }
  }, [filtered, sortBy]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-ink">Browse gear</h1>
          <p className="mt-1 text-sm text-ink-soft">Loading gear...</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 animate-pulse rounded-sm bg-paper-dim" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <EmptyState
          title="Failed to load gear"
          description="There was an error loading the gear. Please try again later."
        />
      </div>
    );
  }

  const activeFilters = [];
  if (searchQuery) activeFilters.push({ type: 'search', value: searchQuery });
  if (brandQuery) activeFilters.push({ type: 'brand', value: brandQuery });
  if (selectedCategory) {
    const cat = categories.find((c: Category) => c.id === selectedCategory || c.slug === selectedCategory);
    if (cat) activeFilters.push({ type: 'category', value: cat.name, id: selectedCategory });
  }
  if (priceRange.min || priceRange.max) {
    activeFilters.push({ type: 'price', value: `$${priceRange.min || '0'}-$${priceRange.max || '∞'}` });
  }
  if (availableOnly) activeFilters.push({ type: 'available', value: 'Available only' });
  if (rentalDates.start || rentalDates.end) {
    activeFilters.push({ type: 'dates', value: `${rentalDates.start || 'Any'} to ${rentalDates.end || 'Any'}` });
  }

  const clearFilter = (type: string, id?: string) => {
    if (type === 'search') {
      setSearchQuery('');
      updateURL({ q: '' });
    } else if (type === 'brand') {
      setBrandQuery('');
    } else if (type === 'category') {
      setSelectedCategory('');
      updateURL({ category: '' });
    } else if (type === 'price') {
      setPriceRange({ min: '', max: '' });
    } else if (type === 'available') {
      setAvailableOnly(false);
    } else if (type === 'dates') {
      setRentalDates({ start: '', end: '' });
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setBrandQuery('');
    setPriceRange({ min: '', max: '' });
    setRentalDates({ start: '', end: '' });
    setAvailableOnly(false);
    setSortBy('featured');
    updateURL({ q: '', category: '' });
  };

  const updateURL = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ q: searchQuery });
  };

  const filterForm = (
    <form className="dashed-border rounded-sm bg-paper-dim/50 p-4 md:sticky md:top-24">
      <div className="mb-5">
        <Label htmlFor="q">Search</Label>
        <div className="flex gap-2">
          <Input 
            id="q" 
            name="q" 
            placeholder="Tent, kayak, rope…" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="button" size="sm" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <fieldset className="mb-5">
        <legend className="mb-2 text-sm font-medium text-ink">Category</legend>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
            <input
              type="radio"
              name="category"
              value=""
              checked={!selectedCategory}
              onChange={() => { setSelectedCategory(''); updateURL({ category: '' }); }}
              className="accent-moss"
            />
            All categories
          </label>
          {categories.map((c: Category) => (
            <label key={c.id} className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
              <input
                type="radio"
                name="category"
                value={c.id}
                checked={selectedCategory === c.id}
                onChange={() => { setSelectedCategory(c.id); updateURL({ category: c.id }); }}
                className="accent-moss"
              />
              {c.name}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mb-5">
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          name="brand"
          placeholder="TrailPeak, VeloForge..."
          value={brandQuery}
          onChange={(e) => setBrandQuery(e.target.value)}
        />
      </div>

      <div className="mb-5">
        <legend className="mb-2 text-sm font-medium text-ink">Price / day ($)</legend>
        <div className="flex items-center gap-2">
          <Input 
            type="number" 
            placeholder="Min" 
            aria-label="Minimum price"
            value={priceRange.min}
            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
          />
          <span className="text-ink-soft">–</span>
          <Input 
            type="number" 
            placeholder="Max" 
            aria-label="Maximum price"
            value={priceRange.max}
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
          />
        </div>
      </div>

      <div className="mb-5">
        <legend className="mb-2 text-sm font-medium text-ink">Rental dates</legend>
        <div className="grid grid-cols-1 gap-2">
          <Input
            type="date"
            aria-label="Rental start date"
            value={rentalDates.start}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setRentalDates((prev) => ({ ...prev, start: e.target.value }))}
          />
          <Input
            type="date"
            aria-label="Rental end date"
            value={rentalDates.end}
            min={rentalDates.start || new Date().toISOString().slice(0, 10)}
            onChange={(e) => setRentalDates((prev) => ({ ...prev, end: e.target.value }))}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
        <input 
          type="checkbox" 
          className="accent-moss" 
          checked={availableOnly}
          onChange={(e) => setAvailableOnly(e.target.checked)}
        />
        Available only
      </label>
    </form>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Browse gear</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {filtered.length} item{filtered.length === 1 ? "" : "s"} available
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="md:hidden"
          onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
          aria-controls="gear-filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-ink-soft">Active filters:</span>
          {activeFilters.map((filter, idx) => (
            <Badge 
              key={idx} 
              variant="moss" 
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => clearFilter(filter.type, filter.id)}
            >
              {filter.value}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-ink-soft hover:text-rust"
            onClick={clearAllFilters}
          >
            Clear all
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
        {/* Filters — collapsible sheet on mobile, sticky sidebar on desktop */}
        <aside className="space-y-6">
          <div id="gear-filters" className={filtersOpen ? "block" : "hidden md:block"}>
            {filterForm}
          </div>
        </aside>

        {/* Results */}
        <div>
          {filtered.length === 0 ? (
            <EmptyState
              title="No gear matches your filters"
              description="Try widening your search — a different category or a broader price range often does it."
              action={
                <Button onClick={clearAllFilters} variant="outline">
                  Clear all filters
                </Button>
              }
            />
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-ink-soft">
                  Showing {filtered.length} result{filtered.length === 1 ? "" : "s"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-ink-soft">Sort by:</span>
                  <select
                    className="rounded-sm border border-line bg-paper px-2 py-1 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-moss"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort gear results"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {sorted.map((gear) => (
                  <GearCard key={gear.id} gear={gear} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
