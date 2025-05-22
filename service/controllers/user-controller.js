import { registerUser} from '../services/userServices.js';
import  {User} from '../models/UserModel.js'
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {searchUsersService, createProfileService, getProfileByUserIdService, updateProfileByUserIdService} from '../services/userServices.js';
dotenv.config();

/**
 * Handles user registration
 */
export const getRegister = async (req, res) => {
    try {
      const createdUser = await registerUser(req.body);
  
      if (!createdUser) {
        return res.status(400).json({ message: "User creation failed" });
      }
  
      // Send a proper response with a 201 status
      res.status(201).json({
        message: "User registered successfully",
        user: createdUser, // Include the user data
      });
    } catch (error) {
      // Send a detailed error message with a 400 or 500 status
      res.status(400).json({ message: error.message });
    }
  };


/**
 * Generates a JWT token
 * @param {String} userId - User ID to be encoded in the token
 * @returns {String} - Generated JWT token
 */
const generateJWT = (userId) => {
    const secretKey = process.env.JWT_SECRET || 'ITSYOURROOMIE'; // Use a secret key from env
    return jwt.sign({ userId }, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
  };



//======================================loginUser===============================================
  
  /**
   * Handles user login
   */
  export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // console.log("For debugging purpose Request Body:", req.body);  // Debugging log
  
      // Ensure email is lowercase for case-insensitive comparison
      const user = await User.findOne({ email: email.toLowerCase() });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
  
      // console.log("User found:", user);  // for debugging
  
      // Ensure that the password exists in the user object
    if (!user.password) {
        return res.status(500).json({ message: "Password not found in the database" });
    }
      // console.log("User password (hashed):", user.password); // for debugging

      // Check password (bcrypt compares the plaintext password with the stored hashed password)
      const isPasswordValid = await bcrypt.compare(password, user.password);
      // console.log("Password valid:", isPasswordValid); // for debugging

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT and handle login success
      const token = generateJWT(user._id);  // Make sure the token is defined here
      res.status(200).json({ message: "Login successful", token , user}); // Sending token in response
    } catch (err) {
      // console.error("Error during login:", err);
      res.status(500).json({ message: "Server error", error: err.message }); // Return detailed error
    }
  };

    /**
     * Controller to handle user search by name or email.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    export const searchUsers = async (req, res) => {
        const { q } = req.query;
    
        try {
        const users = await searchUsersService(q);
        res.status(200).json(users);
        } catch (error) {
        console.error('Error fetching users:', error);
        res.status(400).json({ message: error.message });
        }
    };


//========================================ProfileUser===============================================


// Get user profile
export const getUserProfile = async (req, res) => {

    const userId = req.params.userId;

    try{

    // step 1: Validate the user ID
    if(!mongoose.Types.ObjectId.isValid(userId)){
        return res.status(400).json({message: "Invalid user ID"});
    }

    // step2 : check if the user exists
    const userExists = await User.findById(userId);
    if(!userExists){
        return res.status(404).json({message: "User not found"});
    }
    

    res.status(200).json({message: "User profile fetched successfully", user: userExists});
    // step 3: Fetch the user profile
    let userProfile = await User.findOne({userId}).populate('userId', 'email');
    
       }catch(err){
        console.error("Error during fetching user profile:", err);
        res.status(500).json({message: "Server error", error: err.message});
    }
}

// ========================================UpdateUserProfile===============================================
// Create a profile

export const createProfile = async (req, res) => {
    try {
      const profile = await createProfileService(req.body);
      res.status(201).json({ message: 'Profile created successfully', profile });
    } catch (error) {
      console.error('Error creating profile:', error);
      res.status(500).json({ message: 'Failed to create profile', error: error.message });
    }
  };
  
  // Get a profile by userId
  export const getProfileByUserId = async (req, res) => {
    try {
      const profile = await getProfileByUserIdService(req.params.userId);
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.status(200).json({ profile });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
    }
  };
  
  // Update a profile by userId
  export const updateProfileByUserId = async (req, res) => {
    try {
      const profile = await updateProfileByUserIdService(req.params.userId, req.body);
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.status(200).json({ message: 'Profile updated successfully', profile });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Failed to update profile', error: error.message });
    }
  };