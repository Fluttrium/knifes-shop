import {
  CartItem,
  WishlistItem,
  AddToCartDto,
  UpdateCartItemDto,
  CartResponse,
  WishlistResponse,
} from "./types/cart";
import instance from "./config";

export class CartService {
  // Корзина
  async getCart(): Promise<CartResponse> {
    const response = await instance.get<CartResponse>("/cart");
    return response.data;
  }

  async addToCart(itemData: AddToCartDto): Promise<CartItem> {
    const response = await instance.post<CartItem>("/cart/items", itemData);
    console.log("✅ Item added to cart successfully");
    return response.data;
  }

  async updateCartItem(
    id: string,
    itemData: UpdateCartItemDto,
  ): Promise<CartItem> {
    const response = await instance.patch<CartItem>(
      `/cart/items/${id}`,
      itemData,
    );
    console.log("✅ Cart item updated successfully");
    return response.data;
  }

  async removeFromCart(id: string): Promise<{ message: string }> {
    const response = await instance.delete(`/cart/items/${id}`);
    console.log("✅ Item removed from cart successfully");
    return response.data;
  }

  async clearCart(): Promise<{ message: string }> {
    const response = await instance.delete("/cart");
    console.log("✅ Cart cleared successfully");
    return response.data;
  }

  async getCartItemCount(): Promise<{ count: number }> {
    const response = await instance.get<{ count: number }>("/cart/count");
    return response.data;
  }

  // Избранное
  async getWishlist(): Promise<WishlistResponse> {
    const response = await instance.get<WishlistResponse>("/wishlist");
    return response.data;
  }

  async addToWishlist(productId: string): Promise<WishlistItem> {
    const response = await instance.post<WishlistItem>("/wishlist/items", {
      productId,
    });
    console.log("✅ Item added to wishlist successfully");
    return response.data;
  }

  async removeFromWishlist(id: string): Promise<{ message: string }> {
    const response = await instance.delete(`/wishlist/items/${id}`);
    console.log("✅ Item removed from wishlist successfully");
    return response.data;
  }

  async clearWishlist(): Promise<{ message: string }> {
    const response = await instance.delete("/wishlist");
    console.log("✅ Wishlist cleared successfully");
    return response.data;
  }

  async isInWishlist(productId: string): Promise<{ isInWishlist: boolean }> {
    const response = await instance.get<{ isInWishlist: boolean }>(
      `/wishlist/check/${productId}`,
    );
    return response.data;
  }

  async getWishlistCount(): Promise<{ count: number }> {
    const response = await instance.get<{ count: number }>("/wishlist/count");
    return response.data;
  }
}
