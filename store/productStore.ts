import { create } from 'zustand';

import { productsAPI } from '../libs/api';

export interface Product {
  idsanpham: string;
  tensanpham: string;
  gia: number;
  hinhanh: string;
  loaisp: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;

  // CRUD operations
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  createProduct: (product: Omit<Product, 'idsanpham' | 'user'>) => Promise<string | null>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Image handling
  uploadImage: (uri: string) => Promise<string | null>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  currentProduct: null,
  loading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const data = await productsAPI.getProducts();

      set({ products: data, loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch products',
        loading: false,
      });
    }
  },

  fetchProductById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const data = await productsAPI.getProductById(id);

      set({ currentProduct: data, loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch product',
        loading: false,
      });
    }
  },

  createProduct: async (product) => {
    try {
      set({ loading: true, error: null });
      const data = await productsAPI.createProduct(product);

      // Update products list with the new product
      set((state) => ({
        products: [data, ...state.products],
        loading: false,
      }));

      return data.idsanpham;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create product',
        loading: false,
      });
      return null;
    }
  },

  updateProduct: async (id: string, updates: Partial<Product>) => {
    try {
      set({ loading: true, error: null });
      const data = await productsAPI.updateProduct(id, updates);

      // Update products list with the updated product
      set((state) => ({
        products: state.products.map((p) => (p.idsanpham === id ? { ...p, ...data } : p)),
        currentProduct:
          state.currentProduct?.idsanpham === id
            ? { ...state.currentProduct, ...data }
            : state.currentProduct,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update product',
        loading: false,
      });
    }
  },

  deleteProduct: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await productsAPI.deleteProduct(id);

      // Remove product from the list
      set((state) => ({
        products: state.products.filter((p) => p.idsanpham !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete product',
        loading: false,
      });
    }
  },

  uploadImage: async (uri: string) => {
    try {
      const imageUrl = await productsAPI.uploadImage(uri);
      return imageUrl;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to upload image',
      });
      return null;
    }
  },
}));
