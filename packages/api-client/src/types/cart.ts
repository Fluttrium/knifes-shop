export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: string;
    stockQuantity: number;
    images: Array<{
      id: string;
      url: string;
      alt?: string;
      isPrimary: boolean;
    }>;
    variants?: Array<{
      id: string;
      name: string;
      sku: string;
      price: string;
      stockQuantity: number;
    }>;
  };
  variant?: {
    id: string;
    name: string;
    sku: string;
    price: string;
    stockQuantity: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: string;
    images: Array<{
      id: string;
      url: string;
      alt?: string;
      isPrimary: boolean;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartDto {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CartResponse {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface WishlistResponse {
  items: WishlistItem[];
  totalItems: number;
}
