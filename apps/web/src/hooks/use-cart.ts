import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CartService, CartResponse } from '@repo/api-client';
import { useAuth } from './use-auth';
import { toast } from 'react-hot-toast';

export const useCart = () => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  const cartService = useMemo(() => new CartService(), []);

  const handleError = (err: any, defaultMessage: string) => {
    console.error('Cart error:', err);
    
    if (err.response?.status === 401) {
      setError('Сессия истекла. Пожалуйста, войдите снова.');
      toast.error('Сессия истекла. Пожалуйста, войдите снова.');
      return;
    }
    
    const errorMessage = err.response?.data?.message || err.message || defaultMessage;
    setError(errorMessage);
    toast.error(errorMessage);
  };

  const performCartOperation = useCallback(async (
    operation: () => Promise<any>,
    successMessage: string,
    errorMessage: string
  ) => {
    if (!isAuthenticated) {
      toast.error('Необходимо войти в систему');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await operation();
      toast.success(successMessage);
      const cartData = await cartService.getCart();
      setCart(cartData);
      return true;
    } catch (err: any) {
      handleError(err, errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, cartService]);

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    if (loadingRef.current) return;
    loadingRef.current = true;

    setLoading(true);
    setError(null);

    try {
      const cartData = await cartService.getCart();
      setCart(cartData);
    } catch (err) {
      handleError(err, 'Не удалось загрузить корзину');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [isAuthenticated, cartService]);

  const addToCart = useCallback(async (
    productId: string,
    quantity: number = 1,
    variantId?: string
  ) => {
    return performCartOperation(
      () => cartService.addToCart({ productId, quantity, variantId }),
      'Товар добавлен в корзину',
      'Не удалось добавить товар в корзину'
    );
  }, [performCartOperation, cartService]);

  const updateCartItem = useCallback(async (
    itemId: string,
    quantity: number
  ) => {
    return performCartOperation(
      () => cartService.updateCartItem(itemId, { quantity }),
      'Количество обновлено',
      'Не удалось обновить количество'
    );
  }, [performCartOperation, cartService]);

  const removeFromCart = useCallback(async (itemId: string) => {
    return performCartOperation(
      () => cartService.removeFromCart(itemId),
      'Товар удален из корзины',
      'Не удалось удалить товар'
    );
  }, [performCartOperation, cartService]);

  const clearCart = useCallback(async () => {
    return performCartOperation(
      () => cartService.clearCart(),
      'Корзина очищена',
      'Не удалось очистить корзину'
    );
  }, [performCartOperation, cartService]);

  const getCartItemCount = useCallback(async () => {
    if (!isAuthenticated) return 0;

    try {
      const { count } = await cartService.getCartItemCount();
      return count;
    } catch (err) {
      console.error('Error getting cart count:', err);
      return 0;
    }
  }, [isAuthenticated, cartService]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart(null);
      setError(null);
    }
  }, [isAuthenticated, loadCart]);

  return {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
    loadCart,
  };
}; 