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
  description?: string;
  shortDescription?: string;
  slug: string;
  brand?: string;
  sku: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  weight?: number;
  dimensions?: string;
  stockQuantity: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  productType: 'knife' | 'sharpener' | 'sheath' | 'accessory' | 'gift_set';
  material?: 'stainless_steel' | 'carbon_steel' | 'damascus_steel' | 'ceramic' | 'titanium' | 'wood' | 'plastic' | 'leather' | 'synthetic';
  handleType?: 'fixed' | 'folding' | 'multi_tool';
  bladeLength?: number;
  totalLength?: number;
  bladeHardness?: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  sortOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
  categoryId: string;
  category: Category;
  images: ProductImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku: string;
  price: number;
  brand?: string;
  comparePrice?: number;
  costPrice?: number;
  weight?: number;
  dimensions?: string;
  stockQuantity: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  productType: 'knife' | 'sharpener' | 'sheath' | 'accessory' | 'gift_set';
  material?: 'stainless_steel' | 'carbon_steel' | 'damascus_steel' | 'ceramic' | 'titanium' | 'wood' | 'plastic' | 'leather' | 'synthetic';
  handleType?: 'fixed' | 'folding' | 'multi_tool';
  bladeLength?: number;
  totalLength?: number;
  bladeHardness?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  sortOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
  categoryId: string;
}

export interface UpdateProductDto extends Partial<Omit<CreateProductDto, 'id'>> {}

export interface ProductQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 