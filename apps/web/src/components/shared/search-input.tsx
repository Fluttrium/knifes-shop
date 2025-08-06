"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useClickAway, useDebounce } from "react-use";
import { cn } from "@/lib/utils";
import api, { Product } from "@repo/api-client";

interface Props {
  className?: string;
}

export const SearchInput: React.FC<Props> = ({ className }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);
  const ref = React.useRef(null);

  useClickAway(ref, () => {
    setFocused(false);
  });

  useDebounce(
    async () => {
      if (searchQuery.trim().length < 2) {
        setProducts([]);
        return;
      }

      try {
        setLoading(true);
        const response = await api.products.getProducts({
          search: searchQuery,
          limit: 5,
        });
        setProducts(response.products);
      } catch (error) {
        console.error('Search error:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    300,
    [searchQuery],
  );

  const onClickItem = () => {
    setFocused(false);
    setSearchQuery("");
    setProducts([]);
  };

  const getPrimaryImage = (images: any[] | undefined) => {
    if (!images || images.length === 0) return "/placeholder.jpg";
    const primaryImage = images.find((img) => img.isPrimary);
    return primaryImage?.url || images[0]?.url || "/placeholder.jpg";
  };

  return (
    <>
      {focused && (
        <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/50 z-30" />
      )}

      <div
        ref={ref}
        className={cn(
          "flex rounded-2xl flex-1 justify-between relative h-11 z-30",
          className,
        )}
      >
        <Search className="absolute top-1/2 translate-y-[-50%] left-3 h-5 text-gray-400" />
        <input
          className="rounded-2xl outline-none w-full bg-gray-100 pl-11 pr-4"
          type="text"
          placeholder="Найти товар..."
          onFocus={() => setFocused(true)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {focused && (products.length > 0 || loading) && (
          <div
            className={cn(
              "absolute w-full bg-white rounded-xl py-2 top-14 shadow-md transition-all duration-200 z-30",
            )}
          >
            {loading ? (
              <div className="px-3 py-2 text-gray-500">Поиск...</div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <Link
                  onClick={onClickItem}
                  key={product.id}
                  className="flex items-center gap-3 w-full px-3 py-2 hover:bg-primary/10"
                  href={`/product/${product.slug}`}
                >
                  <img
                    className="rounded-sm h-8 w-8 object-cover"
                    src={getPrimaryImage(product.images)}
                    alt={product.name}
                  />
                  <span className="truncate">{product.name}</span>
                </Link>
              ))
            ) : searchQuery.trim().length >= 2 ? (
              <div className="px-3 py-2 text-gray-500">Товары не найдены</div>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
};
