export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  productVariantId?: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    images: Array<{
      id: string;
      url: string;
      alt: string;
      isPrimary: boolean;
    }>;
    variants?: Array<{
      id: string;
      name: string;
      sku: string;
      price: number;
      salePrice?: number;
      stockQuantity: number;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    images: Array<{
      id: string;
      url: string;
      alt: string;
      isPrimary: boolean;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AddToCartDto {
  productId: string;
  productVariantId?: string;
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
