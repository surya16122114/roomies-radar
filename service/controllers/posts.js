import * as postService from '../services/post-service.js';
import { uploadToS3 } from '../services/uploadService.js';

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const { posts, currentPage, totalPages, totalPosts } = await postService.getAllPosts(req.query);

    res.status(200).json({
      posts,
      currentPage,
      totalPages,
      totalPosts,
    });
  } catch (error) {
    console.error(`[Error] getAllPosts: ${error.message}`, error);
    res.status(error.statusCode || 500).json({
      error: error.name || 'InternalServerError',
      message: error.message || 'An unexpected error occurred',
    });
  }
};


// Get a single post by postId
export const getPostById = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.postId);
    res.status(200).json(post);
  } catch (error) {
    console.error(`[Error] getPostById: ${error.message}`, error);
    res.status(error.statusCode || 500).json({
      error: error.name || 'InternalServerError',
      message: error.message || 'An unexpected error occurred',
    });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    const post = await postService.createPost(req.body);
    res.status(201).json(post);
  } catch (error) {
    console.error(`[Error] createPost: ${error.message}`, error);
    res.status(error.statusCode || 500).json({
      error: error.name || 'InternalServerError',
      message: error.message || 'An unexpected error occurred',
    });
  }
};

// Update an existing post
export const updatePost = async (req, res) => {
  try {
    const updatedPost = await postService.updatePost(req.params.postId, req.body);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(`[Error] updatePost: ${error.message}`, error);
    res.status(error.statusCode || 500).json({
      error: error.name || 'InternalServerError',
      message: error.message || 'An unexpected error occurred',
    });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await postService.deletePost(req.params.postId);
    res.status(200).json({
      message: `Post with ID ${req.params.postId} successfully deleted`,
      post,
    });
  } catch (error) {
    console.error(`[Error] deletePost: ${error.message}`, error);
    res.status(error.statusCode || 500).json({
      error: error.name || 'InternalServerError',
      message: error.message || 'An unexpected error occurred',
    });
  }
};

// Get posts by user ID
export const getPostsByUserId = async (req, res) => {
  try {
    const posts = await postService.getPostsByUserId(req.params.userId);
    res.status(200).json(posts);
  } catch (error) {
    console.error(`[Error] getPostsByUserId: ${error.message}`, error);
    res.status(error.statusCode || 500).json({
      error: error.name || 'InternalServerError',
      message: error.message || 'An unexpected error occurred',
    });
  }
};

export const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Upload files to S3 and get URLs
    const fileUrls = await Promise.all(
      req.files.map((file) => uploadToS3(file))
    );

    res.status(200).json({ urls: fileUrls });
  } catch (error) {
    console.error('[Error] uploadFiles:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
};