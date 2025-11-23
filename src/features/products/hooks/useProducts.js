/**
 * useProducts Hook
 * Hook personalizado para gestionar productos
 */

import { useState, useEffect } from 'react';
import { getAllProducts, getProductById, getProductsByCategory } from '../services/productService';

/**
 * Hook para obtener todos los productos
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { products: data, error: err } = await getAllProducts();
      
      if (err) {
        setError(err);
      } else {
        setProducts(data);
      }
      
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const refetch = async () => {
    setLoading(true);
    const { products: data, error: err } = await getAllProducts();
    
    if (err) {
      setError(err);
    } else {
      setProducts(data);
    }
    
    setLoading(false);
  };

  return { products, loading, error, refetch };
};

/**
 * Hook para obtener un producto por ID
 */
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      const { product: data, error: err } = await getProductById(productId);
      
      if (err) {
        setError(err);
      } else {
        setProduct(data);
      }
      
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};

/**
 * Hook para obtener productos por categoría
 */
export const useProductsByCategory = (category) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      const { products: data, error: err } = await getProductsByCategory(category);
      
      if (err) {
        setError(err);
      } else {
        setProducts(data);
      }
      
      setLoading(false);
    };

    fetchProducts();
  }, [category]);

  return { products, loading, error };
};
