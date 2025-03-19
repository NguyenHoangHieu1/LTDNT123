import { create } from 'zustand';
import { supabase } from '../libs/supabase';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  inventory: number;
  features: string[];
  created_at?: string;
  user_id?: string;
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;

  // CRUD operations
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  createProduct: (product: Omit<Product, 'id'>) => Promise<string | null>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Image handling
  uploadImage: (uri: string, fileName: string) => Promise<string | null>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  currentProduct: null,
  loading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ products: data as Product[], loading: false });
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
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

      if (error) throw error;

      set({ currentProduct: data as Product, loading: false });
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
      const { data, error } = await supabase.from('products').insert([product]).select();

      if (error) throw error;

      // Update products list with the new product
      set((state) => ({
        products: [data[0] as Product, ...state.products],
        loading: false,
      }));

      return data[0].id;
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
      const { error } = await supabase.from('products').update(updates).eq('id', id);

      if (error) throw error;

      // Update products list with the updated product
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        currentProduct:
          state.currentProduct?.id === id
            ? { ...state.currentProduct, ...updates }
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
      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) throw error;

      // Remove product from the list
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete product',
        loading: false,
      });
    }
  },

  uploadImage: async (uri: string, fileName: string) => {
    try {
      // Convert URI to Blob
      const response = await fetch(uri);
      const blob = await response.blob();

      const fileExt = fileName.split('.').pop();
      const filePath = `${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage.from('product-images').upload(filePath, blob);

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to upload image',
      });
      return null;
    }
  },
}));
