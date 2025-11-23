/**
 * Blog Service
 * Servicios de gestión de posts del blog en Firestore
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
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/services/firebase';

const BLOG_POSTS_COLLECTION = 'blogPosts';

/**
 * Obtener todos los posts publicados
 */
export const getAllPosts = async () => {
  try {
    const postsRef = collection(db, BLOG_POSTS_COLLECTION);
    const q = query(
      postsRef,
      where('published', '==', true),
      orderBy('publishedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    return { posts, error: null };
  } catch (error) {
    console.error('Error getting posts:', error);
    return { posts: [], error: error.message };
  }
};

/**
 * Obtener post por ID
 */
export const getPostById = async (postId) => {
  try {
    const postRef = doc(db, BLOG_POSTS_COLLECTION, postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      return { post: { id: postSnap.id, ...postSnap.data() }, error: null };
    }

    return { post: null, error: 'Post no encontrado' };
  } catch (error) {
    console.error('Error getting post:', error);
    return { post: null, error: error.message };
  }
};

/**
 * Obtener posts por autor (profesor)
 */
export const getPostsByAuthor = async (authorId) => {
  try {
    const postsRef = collection(db, BLOG_POSTS_COLLECTION);
    const q = query(
      postsRef,
      where('authorId', '==', authorId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    return { posts, error: null };
  } catch (error) {
    console.error('Error getting posts by author:', error);
    return { posts: [], error: error.message };
  }
};

/**
 * Obtener posts por categoría
 */
export const getPostsByCategory = async (category) => {
  try {
    const postsRef = collection(db, BLOG_POSTS_COLLECTION);
    const q = query(
      postsRef,
      where('category', '==', category),
      where('published', '==', true),
      orderBy('publishedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    return { posts, error: null };
  } catch (error) {
    console.error('Error getting posts by category:', error);
    return { posts: [], error: error.message };
  }
};

/**
 * Crear nuevo post
 */
export const createPost = async (postData) => {
  try {
    const postsRef = collection(db, BLOG_POSTS_COLLECTION);
    const now = new Date().toISOString();
    
    const docRef = await addDoc(postsRef, {
      ...postData,
      published: postData.published || false,
      publishedAt: postData.published ? now : null,
      createdAt: now,
      updatedAt: now,
      views: 0,
      likes: 0,
    });

    return { postId: docRef.id, error: null };
  } catch (error) {
    console.error('Error creating post:', error);
    return { postId: null, error: error.message };
  }
};

/**
 * Actualizar post
 */
export const updatePost = async (postId, updates) => {
  try {
    const postRef = doc(db, BLOG_POSTS_COLLECTION, postId);
    const now = new Date().toISOString();
    
    const updateData = {
      ...updates,
      updatedAt: now,
    };

    // Si se está publicando por primera vez
    if (updates.published && !updates.publishedAt) {
      updateData.publishedAt = now;
    }

    await updateDoc(postRef, updateData);

    return { error: null };
  } catch (error) {
    console.error('Error updating post:', error);
    return { error: error.message };
  }
};

/**
 * Eliminar post
 */
export const deletePost = async (postId) => {
  try {
    const postRef = doc(db, BLOG_POSTS_COLLECTION, postId);
    await deleteDoc(postRef);

    return { error: null };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { error: error.message };
  }
};

/**
 * Incrementar vistas de un post
 */
export const incrementPostViews = async (postId) => {
  try {
    const postRef = doc(db, BLOG_POSTS_COLLECTION, postId);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      const currentViews = postSnap.data().views || 0;
      await updateDoc(postRef, {
        views: currentViews + 1,
      });
    }

    return { error: null };
  } catch (error) {
    console.error('Error incrementing views:', error);
    return { error: error.message };
  }
};

/**
 * Buscar posts por texto
 */
export const searchPosts = async (searchTerm) => {
  try {
    const postsRef = collection(db, BLOG_POSTS_COLLECTION);
    const q = query(
      postsRef,
      where('published', '==', true),
      orderBy('publishedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const posts = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const searchString = `${data.title} ${data.excerpt} ${data.content}`.toLowerCase();
      
      if (searchString.includes(searchTerm.toLowerCase())) {
        posts.push({ id: doc.id, ...data });
      }
    });

    return { posts, error: null };
  } catch (error) {
    console.error('Error searching posts:', error);
    return { posts: [], error: error.message };
  }
};

/**
 * Obtener posts destacados
 */
export const getFeaturedPosts = async (limitCount = 3) => {
  try {
    const postsRef = collection(db, BLOG_POSTS_COLLECTION);
    const q = query(
      postsRef,
      where('featured', '==', true),
      where('published', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);

    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    return { posts, error: null };
  } catch (error) {
    console.error('Error getting featured posts:', error);
    return { posts: [], error: error.message };
  }
};

/**
 * Obtener posts recientes
 */
export const getRecentPosts = async (limitCount = 5) => {
  try {
    const postsRef = collection(db, BLOG_POSTS_COLLECTION);
    const q = query(
      postsRef,
      where('published', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);

    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    return { posts, error: null };
  } catch (error) {
    console.error('Error getting recent posts:', error);
    return { posts: [], error: error.message };
  }
};
