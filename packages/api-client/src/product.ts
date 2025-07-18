import {
  Product,
  ProductResponse,
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
  Category,
} from "./types/product";
import instance from "./config";

export class ProductService {
  // Пользовательские методы
  async getProducts(query?: ProductQueryDto): Promise<ProductResponse> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await instance.get<ProductResponse>(`/products?${params.toString()}`);
    return response.data;
  }

  async getProductById(id: string): Promise<Product> {
    const response = await instance.get<Product>(`/products/${id}`);
    return response.data;
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const response = await instance.get<Product>(`/products/slug/${slug}`);
    return response.data;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await instance.get<Product[]>("/products/featured");
    return response.data;
  }

  async getCategories(): Promise<Category[]> {
    const response = await instance.get<Category[]>("/categories");
    return response.data;
  }

  async getCategoryById(id: string): Promise<Category> {
    const response = await instance.get<Category>(`/categories/${id}`);
    return response.data;
  }

  async getProductsByCategory(categoryId: string, query?: ProductQueryDto): Promise<ProductResponse> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await instance.get<ProductResponse>(`/categories/${categoryId}/products?${params.toString()}`);
    return response.data;
  }

  async getBrands(): Promise<string[]> {
    const response = await instance.get<string[]>("/products/brands");
    return response.data;
  }

  // Админские методы
  async createProduct(productData: CreateProductDto): Promise<Product> {
    const response = await instance.post<Product>("/admin/products", productData);
    console.log("✅ Product created successfully");
    return response.data;
  }

  async updateProduct(id: string, productData: UpdateProductDto): Promise<Product> {
    const response = await instance.patch<Product>(`/admin/products/${id}`, productData);
    console.log("✅ Product updated successfully");
    return response.data;
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    const response = await instance.delete(`/admin/products/${id}`);
    console.log("✅ Product deleted successfully");
    return response.data;
  }

  async getAllProductsAdmin(query?: ProductQueryDto): Promise<ProductResponse> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await instance.get<ProductResponse>(`/admin/products?${params.toString()}`);
    return response.data;
  }

  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const response = await instance.post<Category>("/admin/categories", categoryData);
    console.log("✅ Category created successfully");
    return response.data;
  }

  async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
    const response = await instance.patch<Category>(`/admin/categories/${id}`, categoryData);
    console.log("✅ Category updated successfully");
    return response.data;
  }

  async deleteCategory(id: string): Promise<{ message: string }> {
    const response = await instance.delete(`/admin/categories/${id}`);
    console.log("✅ Category deleted successfully");
    return response.data;
  }
} 