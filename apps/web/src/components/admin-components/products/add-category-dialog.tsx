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
import api from "@repo/api-client";
import { notify } from "@/components/ui/toats/basic-toats";

interface AddCategoryDialogProps {
  onCategoryCreated: () => void;
}

interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
}

export function AddCategoryDialog({
  onCategoryCreated,
}: AddCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: "",
    slug: "",
    description: "",
    image: "",
    parentId: "",
    isActive: true,
    sortOrder: 0,
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

    if (!formData.name) {
      notify("Пожалуйста, заполните название категории", "error");
      return;
    }

    // Generate slug if not provided
    if (!formData.slug) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(formData.name) }));
    }

    setIsLoading(true);
    try {
      const categoryData = {
        name: formData.name,
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description || undefined,
        image: formData.image || undefined,
        parentId: formData.parentId || undefined,
        isActive: formData.isActive,
        sortOrder: formData.sortOrder,
      };

      await api.products.createCategory(categoryData);

      notify("Категория успешно создана", "success");
      setIsOpen(false);
      onCategoryCreated();

      // Сброс формы
      setFormData({
        name: "",
        slug: "",
        description: "",
        image: "",
        parentId: "",
        isActive: true,
        sortOrder: 0,
      });
    } catch (error) {
      console.error("Ошибка при создании категории:", error);
      notify("Ошибка при создании категории", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Добавить категорию
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Добавить новую категорию</DialogTitle>
          <DialogDescription>
            Заполните информацию о новой категории
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
                rows={3}
              />
            </div>
            {/* Изображение */}
            <div>
              <Label htmlFor="image" className="mb-1 block">
                URL изображения
              </Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {/* Родительская категория */}
            <div>
              <Label htmlFor="parentId" className="mb-1 block">
                Родительская категория
              </Label>
              <Input
                id="parentId"
                value={formData.parentId}
                onChange={(e) =>
                  setFormData({ ...formData, parentId: e.target.value })
                }
                placeholder="ID родительской категории (необязательно)"
              />
            </div>
            {/* Порядок сортировки */}
            <div>
              <Label htmlFor="sortOrder" className="mb-1 block">
                Порядок сортировки
              </Label>
              <Input
                id="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sortOrder: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
              />
            </div>
            {/* Активность */}
            <div className="flex items-center space-x-2">
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="isActive">Активная категория</Label>
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
              {isLoading ? "Создание..." : "Создать категорию"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
