"use client";

import { useState, useEffect } from "react";
import { ProductsTable } from "@/components/admin-components/products/products-table";
import { AddProductDialog } from "@/components/admin-components/products/add-product-dialog";
import { AddCategoryDialog } from "@/components/admin-components/products/add-category-dialog";
import api, { Product, Category } from "@repo/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  RefreshCw,
  Filter,
  Package,
  Star,
  TrendingUp,
} from "lucide-react";
import { notify } from "@/components/ui/toats/basic-toats";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // Fetching products
      const response = await api.products.getAllProductsAdmin();
      // Products fetched successfully
      setProducts(response.products || []);
      setFilteredProducts(response.products || []);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      notify("Ошибка при загрузке товаров", "error");
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await api.products.getCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      notify("Ошибка при загрузке категорий", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Фильтр по поиску
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (product.sku &&
            product.sku.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    // Фильтр по категории
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.categoryId === selectedCategory,
      );
    }

    // Фильтр по статусу
    if (statusFilter !== "all") {
      switch (statusFilter) {
        case "active":
          filtered = filtered.filter((product) => product.isActive);
          break;
        case "inactive":
          filtered = filtered.filter((product) => !product.isActive);
          break;
        case "featured":
          filtered = filtered.filter((product) => product.isFeatured);
          break;
        case "sale":
          filtered = filtered.filter(
            (product) =>
              product.comparePrice && product.comparePrice < product.price,
          );
          break;
      }
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, statusFilter, products]);

  const handleProductUpdated = () => {
    fetchProducts();
  };

  const handleCategoryCreated = () => {
    fetchCategories();
  };

  const getStatistics = () => {
    const total = products.length;
    const active = products.filter((p) => p.isActive).length;
    const featured = products.filter((p) => p.isFeatured).length;
    const onSale = products.filter(
      (p) => p.comparePrice && p.comparePrice < p.price,
    ).length;

    return { total, active, featured, onSale };
  };

  const stats = getStatistics();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Товары</h1>
            <p className="text-muted-foreground">
              Управление товарами магазина
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Товары</h1>
          <p className="text-muted-foreground">Управление товарами магазина</p>
        </div>
        <div className="flex gap-2">
          <AddCategoryDialog onCategoryCreated={handleCategoryCreated} />
          <AddProductDialog
            categories={categories}
            onProductCreated={handleProductUpdated}
          />
        </div>
      </div>

      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Всего товаров</span>
          </div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Активные</span>
          </div>
          <div className="text-2xl font-bold">{stats.active}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Рекомендуемые</span>
          </div>
          <div className="text-2xl font-bold">{stats.featured}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">На распродаже</span>
          </div>
          <div className="text-2xl font-bold">{stats.onSale}</div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Все категории" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="active">Активные</SelectItem>
            <SelectItem value="inactive">Неактивные</SelectItem>
            <SelectItem value="featured">Рекомендуемые</SelectItem>
            <SelectItem value="sale">На распродаже</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Список товаров ({filteredProducts.length})
            </h3>
          </div>
          <ProductsTable
            products={filteredProducts}
            categories={categories}
            onProductUpdated={handleProductUpdated}
          />
        </div>
      </div>
    </div>
  );
}
