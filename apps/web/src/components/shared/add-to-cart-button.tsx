'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '../../hooks/use-cart';
import { CountButton } from './count-button';

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;
  stockQuantity: number;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const AddToCartButton = ({
  productId,
  variantId,
  stockQuantity,
  className,
  variant = 'default',
  size = 'default',
}: AddToCartButtonProps) => {
  const { addToCart, loading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (quantity > stockQuantity || isAdding) {
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(productId, quantity, variantId);
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= stockQuantity) {
      setQuantity(newQuantity);
    }
  };

  const isOutOfStock = stockQuantity === 0;
  const isDisabled = loading || isAdding || isOutOfStock;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {stockQuantity > 1 && (
        <CountButton
          value={quantity}
          onClick={(type) => {
            if (type === 'plus' && quantity < stockQuantity) {
              handleQuantityChange(quantity + 1);
            } else if (type === 'minus' && quantity > 1) {
              handleQuantityChange(quantity - 1);
            }
          }}
          disabled={isDisabled}
        />
      )}
      
      <Button
        onClick={handleAddToCart}
        disabled={isDisabled}
        variant={variant}
        size={size}
        className="flex-1"
      >
        {isAdding ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <ShoppingCart className="h-4 w-4 mr-2" />
        )}
        {isOutOfStock ? 'Нет в наличии' : isAdding ? 'Добавление...' : 'Добавить в корзину'}
      </Button>
    </div>
  );
}; 