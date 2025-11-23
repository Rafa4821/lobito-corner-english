/**
 * useBlog Hooks
 * Hooks personalizados para gestionar posts del blog
 */

import { useState, useEffect } from 'react';
import {
  getAllPosts,
  getPostById,
  getPostsByAuthor,
  getPostsByCategory,
  incrementPostViews,
} from '../services/blogService';

/**
 * Hook para obtener todos los posts
 */
export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { posts: data, error: err } = await getAllPosts();
      
      if (err) {
        setError(err);
      } else {
        setPosts(data);
      }
      
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const refetch = async () => {
    setLoading(true);
    const { posts: data, error: err } = await getAllPosts();
    
    if (err) {
      setError(err);
    } else {
      setPosts(data);
    }
    
    setLoading(false);
  };

  return { posts, loading, error, refetch };
};

/**
 * Hook para obtener un post por ID
 */
export const usePost = (postId) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      const { post: data, error: err } = await getPostById(postId);
      
      if (err) {
        setError(err);
      } else {
        setPost(data);
        // Incrementar vistas
        if (data) {
          incrementPostViews(postId);
        }
      }
      
      setLoading(false);
    };

    fetchPost();
  }, [postId]);

  return { post, loading, error };
};

/**
 * Hook para obtener posts por autor
 */
export const usePostsByAuthor = (authorId) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authorId) {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      const { posts: data, error: err } = await getPostsByAuthor(authorId);
      
      if (err) {
        setError(err);
      } else {
        setPosts(data);
      }
      
      setLoading(false);
    };

    fetchPosts();
  }, [authorId]);

  return { posts, loading, error };
};

/**
 * Hook para obtener posts por categoría
 */
export const usePostsByCategory = (category) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      const { posts: data, error: err } = await getPostsByCategory(category);
      
      if (err) {
        setError(err);
      } else {
        setPosts(data);
      }
      
      setLoading(false);
    };

    fetchPosts();
  }, [category]);

  return { posts, loading, error };
};
