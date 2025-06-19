import React, { createContext, useState, useEffect, useContext } from 'react';
import { database } from '../../services/firebase';
import { ref, onValue, set, push, remove, get, query, orderByChild, limitToLast, equalTo } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../AuthContext';

export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  category: string;
  sustainabilityScore: number; // 0-100
  carbonFootprint: number; // in kg CO2e
  waterUsage: number; // in liters
  recyclable: boolean;
  biodegradable: boolean;
  packaging: string;
  ingredients: string[];
  certifications: string[];
  imageUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ProductScan {
  id: string;
  productId: string;
  userId: string;
  timestamp: number;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface AlternativeProduct {
  id: string;
  originalProductId: string;
  alternativeProductId: string;
  sustainabilityImprovement: number; // percentage improvement
  reason: string;
}

interface ProductsContextType {
  products: Product[];
  recentScans: ProductScan[];
  alternativeProducts: Record<string, AlternativeProduct[]>;
  isLoading: boolean;
  error: string | null;
  scanProduct: (barcode: string) => Promise<Product | null>;
  getProductById: (id: string) => Promise<Product | null>;
  getProductByBarcode: (barcode: string) => Promise<Product | null>;
  getAlternativesForProduct: (productId: string) => Promise<AlternativeProduct[]>;
  addProductScan: (productId: string, location?: { latitude: number; longitude: number }) => Promise<void>;
  clearRecentScans: () => Promise<void>;
  clearError: () => void;
}

const RECENT_SCANS_STORAGE_KEY = 'ecocatalyst_recent_scans';
const PRODUCTS_STORAGE_KEY = 'ecocatalyst_cached_products';

export const ProductsContext = createContext<ProductsContextType>({
  products: [],
  recentScans: [],
  alternativeProducts: {},
  isLoading: true,
  error: null,
  scanProduct: async () => null,
  getProductById: async () => null,
  getProductByBarcode: async () => null,
  getAlternativesForProduct: async () => [],
  addProductScan: async () => {},
  clearRecentScans: async () => {},
  clearError: () => {},
});

export const useProducts = () => useContext(ProductsContext);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [recentScans, setRecentScans] = useState<ProductScan[]>([]);
  const [alternativeProducts, setAlternativeProducts] = useState<Record<string, AlternativeProduct[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cachedProducts = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (cachedProducts) {
          setProducts(JSON.parse(cachedProducts));
        }
        
        const cachedScans = await AsyncStorage.getItem(RECENT_SCANS_STORAGE_KEY);
        if (cachedScans) {
          setRecentScans(JSON.parse(cachedScans));
        }
      } catch (error) {
        console.error('Failed to load cached product data:', error);
      }
    };
    
    loadCachedData();
  }, []);
  
  useEffect(() => {
    setIsLoading(true);
    
    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const productsList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          
          setProducts(productsList);
          
          AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsList))
            .catch(err => console.error('Failed to cache products:', err));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again later.');
        setIsLoading(false);
      }
    }, (error) => {
      console.error('Database error:', error);
      setError('Database connection error. Please check your internet connection.');
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (!user) return;
    
    const userScansRef = query(
      ref(database, `userScans/${user.uid}`),
      orderByChild('timestamp'),
      limitToLast(10)
    );
    
    const unsubscribe = onValue(userScansRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const scansList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          
          scansList.sort((a, b) => b.timestamp - a.timestamp);
          
          setRecentScans(scansList);
          
          AsyncStorage.setItem(RECENT_SCANS_STORAGE_KEY, JSON.stringify(scansList))
            .catch(err => console.error('Failed to cache recent scans:', err));
        }
      } catch (error) {
        console.error('Error fetching user scans:', error);
      }
    });
    
    return () => unsubscribe();
  }, [user]);
  
  const scanProduct = async (barcode: string): Promise<Product | null> => {
    try {
      setIsLoading(true);
      
      let product = products.find(p => p.barcode === barcode) || null;
      
      if (!product) {
        const productQuery = query(
          ref(database, 'products'),
          orderByChild('barcode'),
          equalTo(barcode)
        );
        
        const snapshot = await get(productQuery);
        const data = snapshot.val();
        
        if (data) {
          const key = Object.keys(data)[0];
          product = {
            id: key,
            ...data[key]
          };
          
          setProducts(prev => {
            const updated = [...prev];
            const index = updated.findIndex(p => p.id === product!.id);
            if (index >= 0) {
              updated[index] = product!;
            } else {
              updated.push(product!);
            }
            return updated;
          });
        }
      }
      
      return product;
    } catch (error) {
      console.error('Error scanning product:', error);
      setError('Failed to scan product. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      let product = products.find(p => p.id === id) || null;
      
      if (!product) {
        const productRef = ref(database, `products/${id}`);
        const snapshot = await get(productRef);
        const data = snapshot.val();
        
        if (data) {
          product = {
            id,
            ...data
          };
          
          setProducts(prev => {
            const updated = [...prev];
            const index = updated.findIndex(p => p.id === id);
            if (index >= 0) {
              updated[index] = product!;
            } else {
              updated.push(product!);
            }
            return updated;
          });
        }
      }
      
      return product;
    } catch (error) {
      console.error('Error getting product by ID:', error);
      setError('Failed to get product details. Please try again.');
      return null;
    }
  };
  
  const getProductByBarcode = async (barcode: string): Promise<Product | null> => {
    try {
      let product = products.find(p => p.barcode === barcode) || null;
      
      if (!product) {
        const productQuery = query(
          ref(database, 'products'),
          orderByChild('barcode'),
          equalTo(barcode)
        );
        
        const snapshot = await get(productQuery);
        const data = snapshot.val();
        
        if (data) {
          const key = Object.keys(data)[0];
          product = {
            id: key,
            ...data[key]
          };
          
          setProducts(prev => {
            const updated = [...prev];
            const index = updated.findIndex(p => p.id === product!.id);
            if (index >= 0) {
              updated[index] = product!;
            } else {
              updated.push(product!);
            }
            return updated;
          });
        }
      }
      
      return product;
    } catch (error) {
      console.error('Error getting product by barcode:', error);
      setError('Failed to get product details. Please try again.');
      return null;
    }
  };
  
  const getAlternativesForProduct = async (productId: string): Promise<AlternativeProduct[]> => {
    try {
      if (alternativeProducts[productId]) {
        return alternativeProducts[productId];
      }
      
      const alternativesRef = ref(database, `alternatives/${productId}`);
      const snapshot = await get(alternativesRef);
      const data = snapshot.val();
      
      if (data) {
        const alternatives = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        setAlternativeProducts(prev => ({
          ...prev,
          [productId]: alternatives
        }));
        
        return alternatives;
      }
      
      return [];
    } catch (error) {
      console.error('Error getting alternative products:', error);
      setError('Failed to get eco-friendly alternatives. Please try again.');
      return [];
    }
  };
  
  const addProductScan = async (productId: string, location?: { latitude: number; longitude: number }): Promise<void> => {
    try {
      if (!user) {
        const newScan: ProductScan = {
          id: `local_${Date.now()}`,
          productId,
          userId: 'anonymous',
          timestamp: Date.now(),
          location
        };
        
        const updatedScans = [newScan, ...recentScans.slice(0, 9)];
        setRecentScans(updatedScans);
        
        await AsyncStorage.setItem(RECENT_SCANS_STORAGE_KEY, JSON.stringify(updatedScans));
        return;
      }
      
      const userScansRef = ref(database, `userScans/${user.uid}`);
      const newScanRef = push(userScansRef);
      
      const scanData: Omit<ProductScan, 'id'> = {
        productId,
        userId: user.uid,
        timestamp: Date.now(),
        location
      };
      
      await set(newScanRef, scanData);
    } catch (error) {
      console.error('Error adding product scan:', error);
      setError('Failed to save scan. Please try again.');
    }
  };
  
  const clearRecentScans = async (): Promise<void> => {
    try {
      setRecentScans([]);
      await AsyncStorage.removeItem(RECENT_SCANS_STORAGE_KEY);
      
      if (user) {
        const userScansRef = ref(database, `userScans/${user.uid}`);
        await remove(userScansRef);
      }
    } catch (error) {
      console.error('Error clearing recent scans:', error);
      setError('Failed to clear scan history. Please try again.');
    }
  };
  
  const clearError = () => {
    setError(null);
  };
  
  const value = {
    products,
    recentScans,
    alternativeProducts,
    isLoading,
    error,
    scanProduct,
    getProductById,
    getProductByBarcode,
    getAlternativesForProduct,
    addProductScan,
    clearRecentScans,
    clearError,
  };
  
  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
