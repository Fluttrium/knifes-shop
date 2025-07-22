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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить новый товар</DialogTitle>
          <DialogDescription>
            Заполните информацию о новом товаре
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
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
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug *
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">
                SKU *
              </Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryId" className="text-right">
                Категория *
              </Label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productType" className="text-right">
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
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="knife">Нож</option>
                <option value="sharpener">Точилка</option>
                <option value="sheath">Ножны</option>
                <option value="accessory">Аксессуар</option>
                <option value="gift_set">Подарочный набор</option>
              </select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
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
                className="col-span-3"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="comparePrice" className="text-right">
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
                className="col-span-3"
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="costPrice" className="text-right">
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
                className="col-span-3"
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stockQuantity" className="text-right">
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
                className="col-span-3"
                min="0"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">
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
                className="col-span-3"
                min="0"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dimensions" className="text-right">
                Размеры (ДxШxВ см)
              </Label>
              <Input
                id="dimensions"
                value={formData.dimensions}
                onChange={(e) =>
                  setFormData({ ...formData, dimensions: e.target.value })
                }
                className="col-span-3"
                placeholder="18x3x2"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="material" className="text-right">
                Материал
              </Label>
              <select
                id="material"
                value={formData.material}
                onChange={(e) =>
                  setFormData({ ...formData, material: e.target.value as any })
                }
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Выберите материал</option>
                <option value="stainless_steel">Нержавеющая сталь</option>
                <option value="carbon_steel">Углеродистая сталь</option>
                <option value="damascus_steel">Дамаск</option>
                <option value="ceramic">Керамика</option>
                <option value="titanium">Титан</option>
                <option value="wood">Дерево</option>
                <option value="plastic">Пластик</option>
                <option value="leather">Кожа</option>
                <option value="synthetic">Синтетика</option>
              </select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="handleType" className="text-right">
                Тип рукояти
              </Label>
              <select
                id="handleType"
                value={formData.handleType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    handleType: e.target.value as any,
                  })
                }
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Выберите тип рукояти</option>
                <option value="fixed">Фиксированная</option>
                <option value="folding">Складная</option>
                <option value="multi_tool">Мультитул</option>
              </select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bladeLength" className="text-right">
                Длина лезвия (см)
              </Label>
              <Input
                id="bladeLength"
                type="number"
                value={formData.bladeLength}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bladeLength: parseFloat(e.target.value) || 0,
                  })
                }
                className="col-span-3"
                min="0"
                step="0.1"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="totalLength" className="text-right">
                Общая длина (см)
              </Label>
              <Input
                id="totalLength"
                type="number"
                value={formData.totalLength}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalLength: parseFloat(e.target.value) || 0,
                  })
                }
                className="col-span-3"
                min="0"
                step="0.1"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bladeHardness" className="text-right">
                Твердость (HRC)
              </Label>
              <Input
                id="bladeHardness"
                type="number"
                value={formData.bladeHardness}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bladeHardness: parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
                min="0"
                max="70"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shortDescription" className="text-right">
                Краткое описание
              </Label>
              <Textarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
                className="col-span-3"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Описание
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="col-span-3"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Статусы</Label>
              <div className="col-span-3 space-y-2">
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
              {isLoading ? "Создание..." : "Создать товар"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
