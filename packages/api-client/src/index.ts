import { AuthService } from "./auth.js";
import { UserService } from "./user.js";
import { ProductService } from "./product.js";
import { OrderService } from "./order.js";
import { CartService } from "./cart.js";
import { PaymentService } from "./payment.js";
import { uploadApi } from "./upload.js";

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
  upload: uploadApi,
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
  OrderPayment,
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
  Payment,
  PaymentStatusResponse,
  CreatePaymentDto,
  AdminPaymentFilterDto,
  AdminUpdatePaymentStatusDto,

  // Common types
  ApiResponse,
  PaginatedResponse,

  // Upload types
  UploadFileResponse,
  UploadMultipleFilesResponse,
  DeleteFileResponse,
  PresignedUrlResponse,
  UploadFileDto,
  UploadMultipleFilesDto,
  PresignedUrlDto,
  UploadProductImagesResponse,
  DeleteProductImageResponse,
  ReorderProductImagesResponse,
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
