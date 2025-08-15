"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  Plus,
  Star,
  TrendingUp,
  Tag,
} from "lucide-react";
import { Product, Category } from "@repo/api-client";

import api from "@repo/api-client";
import { notify } from "@/components/ui/toats/basic-toats";
import { ImageUpload } from "@/components/shared/image-upload";
import { Card } from "@/components/ui/card";

interface ProductsTableProps {
  products: Product[];
  categories: Category[];
  onProductUpdated: () => void;
}

interface EditProductData {
  name: string;
  slug: string;
  sku: string;
  brand?: string;
  description?: string;
  shortDescription?: string;
  categoryId: string;
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

export function ProductsTable({
  products,
  categories,
  onProductUpdated,
}: ProductsTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editData, setEditData] = useState<EditProductData>({
    name: "",
    slug: "",
    sku: "",
    brand: "",
    description: "",
    shortDescription: "",
    categoryId: "",
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleImageUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploadingImages(true);
    try {
      const response = await api.upload.uploadMultipleFiles(files, {
        folder: "products",
      });

      const newImageUrls = response.data.map((file) => file.url);
      setImages([...images, ...newImageUrls]);

      notify(`Загружено ${files.length} изображений`, "success");
    } catch (error) {
      console.error("Ошибка загрузки изображений:", error);
      notify("Ошибка при загрузке изображений", "error");
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      handleImageUpload(fileArray);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditData({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      brand: product.brand || "",
      description: product.description || "",
      shortDescription: product.shortDescription || "",
      categoryId: product.categoryId,
      price: product.price,
      comparePrice: product.comparePrice || 0,
      costPrice: product.costPrice || 0,
      weight: product.weight || 0,
      dimensions: product.dimensions || "",
      stockQuantity: product.stockQuantity,
      minStockLevel: product.minStockLevel || 5,
      maxStockLevel: product.maxStockLevel || 100,
      productType: product.productType as any,
      material: product.material as any,
      handleType: product.handleType as any,
      bladeLength: product.bladeLength || 0,
      totalLength: product.totalLength || 0,
      bladeHardness: product.bladeHardness || 0,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      isNew: product.isNew || false,
      isOnSale: product.isOnSale || false,
      sortOrder: product.sortOrder || 0,
      metaTitle: product.metaTitle || "",
      metaDescription: product.metaDescription || "",
    });
    // Извлекаем URL изображений из ProductImage[]
    const imageUrls: string[] = [];
    if (product.images) {
      for (const img of product.images) {
        if (img.url) {
          imageUrls.push(img.url);
        }
      }
    }
    setImages(imageUrls);
    setIsEditDialogOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
    setIsViewDialogOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот товар?")) {
      return;
    }

    setIsLoading(true);
    try {
      await api.products.deleteProduct(productId);
      notify("Товар успешно удален", "success");
      onProductUpdated();
    } catch (error) {
      console.error("Ошибка при удалении товара:", error);
      notify("Ошибка при удалении товара", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    setIsLoading(true);
    try {
      // Подготавливаем данные для отправки, исключая id и конвертируя числовые поля
      const updateData = {
        name: editData.name,
        slug: editData.slug,
        sku: editData.sku,
        brand: editData.brand || undefined,
        description: editData.description,
        shortDescription: editData.shortDescription,
        categoryId: editData.categoryId,
        price: Number(editData.price),
        comparePrice: editData.comparePrice
          ? Number(editData.comparePrice)
          : undefined,
        costPrice: editData.costPrice ? Number(editData.costPrice) : undefined,
        weight: editData.weight ? Number(editData.weight) : undefined,
        dimensions: editData.dimensions,
        stockQuantity: Number(editData.stockQuantity),
        minStockLevel: editData.minStockLevel
          ? Number(editData.minStockLevel)
          : undefined,
        maxStockLevel: editData.maxStockLevel
          ? Number(editData.maxStockLevel)
          : undefined,
        productType: editData.productType,
        material: editData.material,
        handleType: editData.handleType,
        bladeLength: editData.bladeLength
          ? Number(editData.bladeLength)
          : undefined,
        totalLength: editData.totalLength
          ? Number(editData.totalLength)
          : undefined,
        bladeHardness: editData.bladeHardness
          ? Number(editData.bladeHardness)
          : undefined,
        isActive: editData.isActive,
        isFeatured: editData.isFeatured,
        isNew: editData.isNew,
        isOnSale: editData.isOnSale,
        sortOrder: editData.sortOrder ? Number(editData.sortOrder) : undefined,
        metaTitle: editData.metaTitle,
        metaDescription: editData.metaDescription,
        // Добавляем изображения
        images: images.map((url, idx) => ({
          url,
          isPrimary: idx === 0,
          sortOrder: idx,
        })),
      };

      await api.products.updateProduct(editingProduct.id, updateData);
      // Update data sent successfully
      notify("Товар успешно обновлен", "success");
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      setImages([]); // Сбрасываем изображения
      onProductUpdated();
    } catch (error) {
      console.error("Ошибка при обновлении товара:", error);
      notify("Ошибка при обновлении товара", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (product: Product) => {
    const badges = [];

    if (product.isActive) {
      badges.push(
        <Badge key="active" variant="default">
          Активен
        </Badge>,
      );
    } else {
      badges.push(
        <Badge key="inactive" variant="secondary">
          Неактивен
        </Badge>,
      );
    }

    if (product.stockQuantity === 0) {
      badges.push(
        <Badge key="outOfStock" variant="destructive">
          Нет в наличии
        </Badge>,
      );
    }

    if (product.isFeatured) {
      badges.push(
        <Badge key="featured" variant="destructive">
          Рекомендуемый
        </Badge>,
      );
    }

    if (product.comparePrice && product.comparePrice < product.price) {
      badges.push(
        <Badge key="sale" variant="outline">
          Распродажа
        </Badge>,
      );
    }

    return <div className="flex gap-1 flex-wrap">{badges}</div>;
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || "Неизвестная категория";
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Товар</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата создания</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <Package className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.shortDescription}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice &&
                      product.comparePrice < product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.comparePrice)}
                        </span>
                      )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(product)}</TableCell>
                <TableCell>{formatDate(product.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Открыть меню</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Действия</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleViewProduct(product)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Просмотр
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Диалог просмотра товара */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Информация о товаре</DialogTitle>
            <DialogDescription>
              Подробная информация о выбранном товаре
            </DialogDescription>
          </DialogHeader>
          {viewingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Название</Label>
                <div className="col-span-3 font-medium">
                  {viewingProduct.name}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Категория</Label>
                <div className="col-span-3">
                  {getCategoryName(viewingProduct.categoryId)}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Цена</Label>
                <div className="col-span-3">
                  <span className="font-medium">
                    {formatPrice(viewingProduct.price)}
                  </span>
                  {viewingProduct.comparePrice &&
                    viewingProduct.comparePrice < viewingProduct.price && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        {formatPrice(viewingProduct.comparePrice)}
                      </span>
                    )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Статус</Label>
                <div className="col-span-3">
                  {getStatusBadge(viewingProduct)}
                </div>
              </div>
              {viewingProduct.weight && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Вес</Label>
                  <div className="col-span-3">{viewingProduct.weight}г</div>
                </div>
              )}
              {viewingProduct.dimensions && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Размеры</Label>
                  <div className="col-span-3">{viewingProduct.dimensions}</div>
                </div>
              )}
              {viewingProduct.stockQuantity !== undefined && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Количество на складе</Label>
                  <div className="col-span-3">
                    {viewingProduct.stockQuantity}
                  </div>
                </div>
              )}
              {viewingProduct.productType && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Тип товара</Label>
                  <div className="col-span-3">{viewingProduct.productType}</div>
                </div>
              )}
              {viewingProduct.material && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Материал</Label>
                  <div className="col-span-3">{viewingProduct.material}</div>
                </div>
              )}
              {viewingProduct.handleType && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Тип рукояти</Label>
                  <div className="col-span-3">{viewingProduct.handleType}</div>
                </div>
              )}
              {viewingProduct.bladeLength && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Длина лезвия</Label>
                  <div className="col-span-3">
                    {viewingProduct.bladeLength}см
                  </div>
                </div>
              )}
              {viewingProduct.totalLength && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Общая длина</Label>
                  <div className="col-span-3">
                    {viewingProduct.totalLength}см
                  </div>
                </div>
              )}
              {viewingProduct.bladeHardness && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Твердость лезвия</Label>
                  <div className="col-span-3">
                    {viewingProduct.bladeHardness} HRC
                  </div>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Описание</Label>
                <div className="col-span-3 text-sm">
                  {viewingProduct.description || "Нет описания"}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Дата создания</Label>
                <div className="col-span-3">
                  {formatDate(viewingProduct.createdAt)}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования товара */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setEditingProduct(null);
            setImages([]); // Сбрасываем изображения при закрытии
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать товар</DialogTitle>
            <DialogDescription>
              Внесите изменения в информацию о товаре
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Название
              </Label>
              <Input
                id="name"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Slug
              </Label>
              <Input
                id="slug"
                value={editData.slug}
                onChange={(e) =>
                  setEditData({ ...editData, slug: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">
                SKU
              </Label>
              <Input
                id="sku"
                value={editData.sku}
                onChange={(e) =>
                  setEditData({ ...editData, sku: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand" className="text-right">
                Бренд
              </Label>
              <Input
                id="brand"
                value={editData.brand || ""}
                onChange={(e) =>
                  setEditData({ ...editData, brand: e.target.value })
                }
                className="col-span-3"
                placeholder="Например: Zwilling, Wüsthof"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryId" className="text-right">
                Категория
              </Label>
              <select
                id="categoryId"
                value={editData.categoryId}
                onChange={(e) =>
                  setEditData({ ...editData, categoryId: e.target.value })
                }
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                Тип товара
              </Label>
              <select
                id="productType"
                value={editData.productType}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    productType: e.target.value as any,
                  })
                }
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="knife">Нож</option>
                <option value="sharpener">Точилка</option>
                <option value="sheath">Ножны</option>
                <option value="accessory">Аксессуар</option>
                <option value="gift_set">Подарочный набор</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="material" className="text-right">
                Материал
              </Label>
              <select
                id="material"
                value={editData.material || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    material: e.target.value as any || undefined,
                  })
                }
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Не указан</option>
                <option value="stainless_steel">Нержавеющая сталь</option>
                <option value="carbon_steel">Углеродистая сталь</option>
                <option value="damascus_steel">Дамасская сталь</option>
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
                value={editData.handleType || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    handleType: e.target.value as any || undefined,
                  })
                }
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Не указан</option>
                <option value="fixed">Фиксированная</option>
                <option value="folding">Складная</option>
                <option value="multi_tool">Мультитул</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Цена
              </Label>
              <Input
                id="price"
                type="number"
                value={editData.price}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="comparePrice" className="text-right">
                Цена для сравнения
              </Label>
              <Input
                id="comparePrice"
                type="number"
                value={editData.comparePrice}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    comparePrice: parseFloat(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="costPrice" className="text-right">
                Себестоимость
              </Label>
              <Input
                id="costPrice"
                type="number"
                value={editData.costPrice}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    costPrice: parseFloat(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stockQuantity" className="text-right">
                Количество на складе
              </Label>
              <Input
                id="stockQuantity"
                type="number"
                value={editData.stockQuantity}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    stockQuantity: parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="minStockLevel" className="text-right">
                Минимальный запас
              </Label>
              <Input
                id="minStockLevel"
                type="number"
                value={editData.minStockLevel}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    minStockLevel: parseInt(e.target.value) || 5,
                  })
                }
                className="col-span-3"
                min="0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxStockLevel" className="text-right">
                Максимальный запас
              </Label>
              <Input
                id="maxStockLevel"
                type="number"
                value={editData.maxStockLevel}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    maxStockLevel: parseInt(e.target.value) || 100,
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
                value={editData.weight}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    weight: parseFloat(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dimensions" className="text-right">
                Размеры
              </Label>
              <Input
                id="dimensions"
                value={editData.dimensions}
                onChange={(e) =>
                  setEditData({ ...editData, dimensions: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bladeLength" className="text-right">
                Длина лезвия (см)
              </Label>
              <Input
                id="bladeLength"
                type="number"
                value={editData.bladeLength}
                onChange={(e) =>
                  setEditData({
                    ...editData,
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
                value={editData.totalLength}
                onChange={(e) =>
                  setEditData({
                    ...editData,
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
                Твердость лезвия (HRC)
              </Label>
              <Input
                id="bladeHardness"
                type="number"
                value={editData.bladeHardness}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    bladeHardness: parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
                min="0"
                max="70"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Описание
              </Label>
              <Textarea
                id="description"
                value={editData.description || ""}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="col-span-3"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shortDescription" className="text-right">
                Краткое описание
              </Label>
              <Textarea
                id="shortDescription"
                value={editData.shortDescription || ""}
                onChange={(e) =>
                  setEditData({ ...editData, shortDescription: e.target.value })
                }
                className="col-span-3"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sortOrder" className="text-right">
                Порядок сортировки
              </Label>
              <Input
                id="sortOrder"
                type="number"
                value={editData.sortOrder}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    sortOrder: parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="metaTitle" className="text-right">
                Meta Title
              </Label>
              <Input
                id="metaTitle"
                value={editData.metaTitle || ""}
                onChange={(e) =>
                  setEditData({ ...editData, metaTitle: e.target.value })
                }
                className="col-span-3"
                placeholder="SEO заголовок страницы"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="metaDescription" className="text-right">
                Meta Description
              </Label>
              <Textarea
                id="metaDescription"
                value={editData.metaDescription || ""}
                onChange={(e) =>
                  setEditData({ ...editData, metaDescription: e.target.value })
                }
                className="col-span-3"
                rows={2}
                placeholder="SEO описание страницы"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Статусы</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editData.isActive}
                    onChange={(e) =>
                      setEditData({ ...editData, isActive: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isActive">Активен</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={editData.isFeatured}
                    onChange={(e) =>
                      setEditData({ ...editData, isFeatured: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isFeatured">Рекомендуемый</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isNew"
                    checked={editData.isNew}
                    onChange={(e) =>
                      setEditData({ ...editData, isNew: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isNew">Новый товар</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isOnSale"
                    checked={editData.isOnSale}
                    onChange={(e) =>
                      setEditData({ ...editData, isOnSale: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isOnSale">На распродаже</Label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Изображения</Label>
              <div className="col-span-3">
                <div className="space-y-4">
                  {/* Существующие изображения */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {images.map((url, idx) => (
                        <Card
                          key={url}
                          className="relative group overflow-hidden"
                        >
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
                          <div className="absolute top-1 right-1 flex gap-1">
                            {/* Кнопка сделать основным */}
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newImages = [...images];
                                  const temp = newImages[0];
                                  const currentImage = newImages[idx];
                                  if (temp && currentImage) {
                                    newImages[0] = currentImage;
                                    newImages[idx] = temp;
                                    setImages(newImages);
                                  }
                                }}
                                className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-600"
                                title="Сделать основным"
                              >
                                ★
                              </button>
                            )}
                            {/* Кнопка удаления */}
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = images.filter(
                                  (_, i) => i !== idx,
                                );
                                setImages(newImages);
                              }}
                              className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                              title="Удалить"
                            >
                              ×
                            </button>
                          </div>
                          <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                            {idx + 1}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Загрузка новых изображений */}
                  {images.length < 10 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        Добавить новые изображения
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={isUploadingImages}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer ${
                          isUploadingImages
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {isUploadingImages ? "Загрузка..." : "Выбрать файлы"}
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        Текущих изображений: {images.length}/10
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button onClick={handleSaveEdit} disabled={isLoading}>
              {isLoading ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
