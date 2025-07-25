'use client';
import React from 'react';
import {useRouter} from 'next/navigation';

import {cn} from '@/lib/utils';
import {Dialog, DialogContent, DialogTitle} from '@/components/ui/dialog';

import { ProductForm } from "@/components/shared/product-form";
// @ts-ignore
import { Product } from '@/types/api-client/src/product.ts';


interface Props {
  product: Product;
  className?: string;
}

export const  ChooseProductModal: React.FC<Props> = ({product, className}) => {
  const router = useRouter();

  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent
        className={cn(
          // Переопределяем все размеры
          "p-0 w-[98vw] max-w-[1800px] h-auto max-h-[98vh] bg-white overflow-hidden",
          // Адаптивные размеры
          "sm:w-[95vw] sm:max-w-[1800px] lg:w-[92vw] xl:w-[90vw]",
          // Убираем стандартные отступы и border
          "border-0 rounded-3xl shadow-2xl",
          className,
        )}
      >
        <DialogTitle className="sr-only">Выбор товара</DialogTitle>
        <div className="w-full h-full overflow-y-auto">
          <ProductForm slug={""} {...() => router.back()} />
        </div>
      </DialogContent>
    </Dialog>
  );
};