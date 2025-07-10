import { AuthService } from "./auth";
import { UserService } from "./user";
import { ProductService } from "./product";
import { OrderService } from "./order";
import { CartService } from "./cart";
import { PaymentService } from "./payment";

const authService = new AuthService();
const userService = new UserService();
const productService = new ProductService();
const orderService = new OrderService();
const cartService = new CartService();
const paymentService = new PaymentService();

export const api = {
  auth: authService,
  users: userService,
  products: productService,
  orders: orderService,
  cart: cartService,
  payments: paymentService,
};

export type {
  // Auth types
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ApiError,
  ApiErrorResponse,
  
  // Product types
  Product,
  Category,
  ProductImage,
  ProductVariant,
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
  ProductResponse,
  
  // Order types
  Order,
  OrderItem,
  Address,
  Payment,
  Parcel,
  CreateOrderDto,
  OrderQueryDto,
  OrderResponse,
  PaymentQueryDto,
  ParcelQueryDto,
  UpdatePaymentDto,
  UpdateParcelDto,
  
  // Cart types
  CartItem,
  WishlistItem,
  AddToCartDto,
  UpdateCartItemDto,
  CartResponse,
  WishlistResponse,
  
  // Payment types
  YooKassaPaymentRequest,
  YooKassaPaymentResponse,
  PaymentStatusResponse,
  CreatePaymentDto,
  PaymentHistoryItem,
  
  // Common types
  ApiResponse,
  PaginatedResponse,
} from "./types";

export { 
  AuthService,
  UserService,
  ProductService,
  OrderService,
  CartService,
  PaymentService,
};

export default api;
