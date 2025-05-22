import express from 'express';
import { getAllPosts, getPostById, createPost, updatePost, deletePost, getPostsByUserId, uploadFiles } from '../controllers/posts.js';
import {uploadPhotos} from '../utils/upload.js'

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:postId', getPostById);
router.post('/', createPost);
router.put('/:postId', updatePost);
router.delete('/:postId', deletePost);
router.get('/user/:userId', getPostsByUserId);
// File upload route
router.post('/file', uploadPhotos, uploadFiles);

export default router;
