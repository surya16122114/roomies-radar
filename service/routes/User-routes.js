import express from "express";
import dotenv from "dotenv";
import { getRegister, loginUser, searchUsers } from '../controllers/user-controller.js';
import { getUserProfile,createProfile,getProfileByUserId, updateProfileByUserId } from '../controllers/user-controller.js';
dotenv.config();


const router = express.Router();


router.post('/auth/user/register', getRegister);
router.post('/auth/user/login', loginUser);
router.get('/search', searchUsers);
router.post('/profile', createProfile);
router.get('/profile/:userId/', getProfileByUserId);
router.patch('/profile/:userId/', updateProfileByUserId);


export default router;