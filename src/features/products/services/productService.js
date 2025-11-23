/**
 * Product Service
 * Servicios de gestión de productos en Firestore
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@/services/firebase';

const PRODUCTS_COLLECTION = 'products';

/**
 * Obtener todos los productos
 */
export const getAllProducts = async () => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    return { products, error: null };
  } catch (error) {
    console.error('Error getting products:', error);
    return { products: [], error: error.message };
  }
};

/**
 * Obtener producto por ID
 */
export const getProductById = async (productId) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      return { product: { id: productSnap.id, ...productSnap.data() }, error: null };
    }

    return { product: null, error: 'Producto no encontrado' };
  } catch (error) {
    console.error('Error getting product:', error);
    return { product: null, error: error.message };
  }
};

/**
 * Obtener productos por categoría
 */
export const getProductsByCategory = async (category) => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef,
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    return { products, error: null };
  } catch (error) {
    console.error('Error getting products by category:', error);
    return { products: [], error: error.message };
  }
};

/**
 * Obtener productos por profesor
 */
export const getProductsByTeacher = async (teacherId) => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef,
      where('teacherId', '==', teacherId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    return { products, error: null };
  } catch (error) {
    console.error('Error getting products by teacher:', error);
    return { products: [], error: error.message };
  }
};

/**
 * Crear nuevo producto
 */
export const createProduct = async (productData) => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { productId: docRef.id, error: null };
  } catch (error) {
    console.error('Error creating product:', error);
    return { productId: null, error: error.message };
  }
};

/**
 * Actualizar producto
 */
export const updateProduct = async (productId, updates) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return { error: null };
  } catch (error) {
    console.error('Error updating product:', error);
    return { error: error.message };
  }
};

/**
 * Eliminar producto
 */
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(productRef);

    return { error: null };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { error: error.message };
  }
};

/**
 * Buscar productos por texto
 */
export const searchProducts = async (searchTerm) => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const querySnapshot = await getDocs(productsRef);

    const products = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const searchString = `${data.title} ${data.description} ${data.category}`.toLowerCase();
      
      if (searchString.includes(searchTerm.toLowerCase())) {
        products.push({ id: doc.id, ...data });
      }
    });

    return { products, error: null };
  } catch (error) {
    console.error('Error searching products:', error);
    return { products: [], error: error.message };
  }
};

/**
 * Obtener productos destacados
 */
export const getFeaturedProducts = async (limitCount = 6) => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsRef,
      where('featured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);

    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    return { products, error: null };
  } catch (error) {
    console.error('Error getting featured products:', error);
    return { products: [], error: error.message };
  }
};
