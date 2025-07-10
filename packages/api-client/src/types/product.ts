export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  weight?: number;
  dimensions?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  slug: string;
  categoryId: string;
  category: Category;
  brand?: string;
  model?: string;
  bladeLength?: number;
  bladeWidth?: number;
  bladeThickness?: number;
  handleLength?: number;
  totalLength?: number;
  weight?: number;
  steelType?: string;
  hardness?: string;
  handleMaterial?: string;
  sheathIncluded?: boolean;
  countryOfOrigin?: string;
  price: number;
  salePrice?: number;
  isActive: boolean;
  isFeatured: boolean;
  rating?: number;
  reviewCount: number;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  brand?: string;
  model?: string;
  bladeLength?: number;
  bladeWidth?: number;
  bladeThickness?: number;
  handleLength?: number;
  totalLength?: number;
  weight?: number;
  steelType?: string;
  hardness?: string;
  handleMaterial?: string;
  sheathIncluded?: boolean;
  countryOfOrigin?: string;
  price: number;
  salePrice?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  id: string;
}

export interface ProductQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 