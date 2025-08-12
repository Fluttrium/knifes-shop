"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Category } from "@repo/api-client";
import api from "@repo/api-client";
import { notify } from "@/components/ui/toats/basic-toats";
import { ImageUpload } from "@/components/shared/image-upload";
import { Card } from "@/components/ui/card";

interface AddProductDialogProps {
  categories: Category[];
  onProductCreated: () => void;
}

interface CreateProductData {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  categoryId: string;
  sku: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  weight?: number;
  dimensions?: string;
  stockQuantity: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  productType: "knife" | "sharpener" | "sheath" | "accessory" | "gift_set";
  material?:
    | "stainless_steel"
    | "carbon_steel"
    | "damascus_steel"
    | "ceramic"
    | "titanium"
    | "wood"
    | "plastic"
    | "leather"
    | "synthetic";
  handleType?: "fixed" | "folding" | "multi_tool";
  bladeLength?: number;
  totalLength?: number;
  bladeHardness?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  sortOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
}

export function AddProductDialog({
  categories,
  onProductCreated,
}: AddProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    categoryId: "",
    sku: "",
    price: 0,
    comparePrice: 0,
    costPrice: 0,
    weight: 0,
    dimensions: "",
    stockQuantity: 0,
    minStockLevel: 5,
    maxStockLevel: 100,
    productType: "knife",
    material: "stainless_steel",
    handleType: "fixed",
    bladeLength: 0,
    totalLength: 0,
    bladeHardness: 0,
    isActive: true,
    isFeatured: false,
    isNew: false,
    isOnSale: false,
    sortOrder: 0,
    metaTitle: "",
    metaDescription: "",
  });
  const [images, setImages] = useState<string[]>([]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.categoryId || formData.price <= 0) {
      notify("Пожалуйста, заполните обязательные поля", "error");
      return;
    }

    // Generate slug if not provided
    if (!formData.slug) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(formData.name) }));
    }

    setIsLoading(true);
    try {
      const productData: any = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        sku: formData.sku,
        categoryId: formData.categoryId,
        price: formData.price,
        stockQuantity: formData.stockQuantity,
        productType: formData.productType,
        description: formData.description || undefined,
        shortDescription: formData.shortDescription || undefined,
        comparePrice:
          formData.comparePrice && formData.comparePrice > 0
            ? formData.comparePrice
            : undefined,
        costPrice:
          formData.costPrice && formData.costPrice > 0
            ? formData.costPrice
            : undefined,
        weight:
          formData.weight && formData.weight > 0 ? formData.weight : undefined,
        dimensions: formData.dimensions || undefined,
        minStockLevel: formData.minStockLevel || undefined,
        maxStockLevel: formData.maxStockLevel || undefined,
        material: formData.material || undefined,
        handleType: formData.handleType || undefined,
        bladeLength:
          formData.bladeLength && formData.bladeLength > 0
            ? formData.bladeLength
            : undefined,
        totalLength:
          formData.totalLength && formData.totalLength > 0
            ? formData.totalLength
            : undefined,
        bladeHardness:
          formData.bladeHardness && formData.bladeHardness > 0
            ? formData.bladeHardness
            : undefined,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        isNew: formData.isNew,
        isOnSale: formData.isOnSale,
        sortOrder: formData.sortOrder || undefined,
        metaTitle: formData.metaTitle || undefined,
        metaDescription: formData.metaDescription || undefined,
        images: images.map((url, idx) => ({
          url,
          isPrimary: idx === 0,
          sortOrder: idx,
        })),
      };

      await api.products.createProduct(productData);

      notify("Товар успешно создан", "success");
      setIsOpen(false);
      onProductCreated();

      // Сброс формы
      setFormData({
        name: "",
        slug: "",
        description: "",
        shortDescription: "",
        categoryId: "",
        sku: "",
        price: 0,
        comparePrice: 0,
        costPrice: 0,
        weight: 0,
        dimensions: "",
        stockQuantity: 0,
        minStockLevel: 5,
        maxStockLevel: 100,
        productType: "knife",
        material: "stainless_steel",
        handleType: "fixed",
        bladeLength: 0,
        totalLength: 0,
        bladeHardness: 0,
        isActive: true,
        isFeatured: false,
        isNew: false,
        isOnSale: false,
        sortOrder: 0,
        metaTitle: "",
        metaDescription: "",
      });
      setImages([]); // Сброс изображений
    } catch (error) {
      console.error("Ошибка при создании товара:", error);
      notify("Ошибка при создании товара", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Добавить товар
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить новый товар</DialogTitle>
          <DialogDescription>
            Заполните информацию о новом товаре
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 py-4">
            {/* Название */}
            <div>
              <Label htmlFor="name" className="mb-1 block">
                Название *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    name,
                    slug: generateSlug(name),
                  });
                }}
                required
              />
            </div>
            {/* Slug */}
            <div>
              <Label htmlFor="slug" className="mb-1 block">
                Slug *
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
              />
            </div>
            {/* SKU */}
            <div>
              <Label htmlFor="sku" className="mb-1 block">
                SKU *
              </Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                required
              />
            </div>
            {/* Категория */}
            <div>
              <Label htmlFor="categoryId" className="mb-1 block">
                Категория *
              </Label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Тип товара */}
            <div>
              <Label htmlFor="productType" className="mb-1 block">
                Тип товара *
              </Label>
              <select
                id="productType"
                value={formData.productType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productType: e.target.value as any,
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="knife">Нож</option>
                <option value="sharpener">Точилка</option>
                <option value="sheath">Ножны</option>
                <option value="accessory">Аксессуар</option>
                <option value="gift_set">Подарочный набор</option>
              </select>
            </div>
            {/* Цена */}
            <div>
              <Label htmlFor="price" className="mb-1 block">
                Цена *
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                required
                min="0"
                step="0.01"
              />
            </div>
            {/* Цена для сравнения */}
            <div>
              <Label htmlFor="comparePrice" className="mb-1 block">
                Цена для сравнения
              </Label>
              <Input
                id="comparePrice"
                type="number"
                value={formData.comparePrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    comparePrice: parseFloat(e.target.value) || 0,
                  })
                }
                min="0"
                step="0.01"
              />
            </div>
            {/* Себестоимость */}
            <div>
              <Label htmlFor="costPrice" className="mb-1 block">
                Себестоимость
              </Label>
              <Input
                id="costPrice"
                type="number"
                value={formData.costPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    costPrice: parseFloat(e.target.value) || 0,
                  })
                }
                min="0"
                step="0.01"
              />
            </div>
            {/* Количество на складе */}
            <div>
              <Label htmlFor="stockQuantity" className="mb-1 block">
                Количество на складе
              </Label>
              <Input
                id="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stockQuantity: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
              />
            </div>
            {/* Вес */}
            <div>
              <Label htmlFor="weight" className="mb-1 block">
                Вес (г)
              </Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weight: parseFloat(e.target.value) || 0,
                  })
                }
                min="0"
              />
            </div>
            {/* СЕКЦИЯ ЗАГРУЗКИ ФОТО */}
            <div>
              <Label className="block mb-2 text-base font-medium text-gray-700">
                Фотографии товара
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Перетащите изображения или выберите файлы. Первое изображение
                станет основным. Максимум 10 файлов, до 5MB каждый.
              </p>
              <ImageUpload
                onImagesUploaded={setImages}
                maxFiles={10}
                maxSize={5 * 1024 * 1024}
                className="mb-2"
              />
              {images.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {images.map((url, idx) => (
                    <Card key={url} className="relative group overflow-hidden">
                      <img
                        src={url}
                        alt={`Фото ${idx + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-0.5 rounded">
                          Основное
                        </span>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
            {/* Краткое описание */}
            <div>
              <Label htmlFor="shortDescription" className="mb-1 block">
                Краткое описание
              </Label>
              <Textarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
                rows={2}
              />
            </div>
            {/* Описание */}
            <div>
              <Label htmlFor="description" className="mb-1 block">
                Описание
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
            </div>
            {/* Статусы */}
            <div>
              <Label className="mb-1 block">Статусы</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isActive">Активен</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isFeatured">Рекомендуемый</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isNew"
                    checked={formData.isNew}
                    onChange={(e) =>
                      setFormData({ ...formData, isNew: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isNew">Новый товар</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isOnSale"
                    checked={formData.isOnSale}
                    onChange={(e) =>
                      setFormData({ ...formData, isOnSale: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isOnSale">На распродаже</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Сохраняем..." : "Создать товар"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
