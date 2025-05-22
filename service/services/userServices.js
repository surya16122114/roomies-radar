import { User } from "../models/UserModel.js";
import  Profile  from "../models/ProfileModel.js";


/**
 * Registers a new user
 *
 * @param {Object} data - User registration data.
 * @returns {Object} Created user or error message.
 */
export const registerUser = async (data) => {
    const { email, password } = data;

    if ( !email || !password) {
        throw new Error('All fields are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Email already exists');
    }

    const user = new User(data);
    return await user.save();
};

export const searchUsersService = async (query) => {
    if (!query) {
      throw new Error('Search query is required');
    }
  
    const regex = new RegExp(query, 'i'); // Case-insensitive regex
    const users = await User.find({
      $or: [
        { firstName: regex },
        { lastName: regex },
        { email: regex }, // Added email search
      ],
    }).select('_id firstName lastName email'); // Limit the fields
  
    return users;
  };

// =============================================ProfileSchema===============================================
// Create a profile
    export const createProfileService = async (profileData) => {
        const profile = new Profile(profileData);
        return await profile.save();
    };
  
  // Get a profile by userId
  export const getProfileByUserIdService = async (userId) => {
    return await Profile.findOne({ userId }).populate('userId', 'firstName lastName email DOB PhoneNumber');
  };
  
  // Update a profile by userId
  export const updateProfileByUserIdService = async (userId, profileData) => {
    const updateQuery = {};
  
    // Flatten updates for nested fields
    if (profileData.workExperience) {
      for (const [key, value] of Object.entries(profileData.workExperience)) {
        updateQuery[`workExperience.${key}`] = value;
      }
    }
  
    if (profileData.education) {
      for (const [key, value] of Object.entries(profileData.education)) {
        updateQuery[`education.${key}`] = value;
      }
    }
  
    if (profileData.preferences) {
      for (const [key, value] of Object.entries(profileData.preferences)) {
        updateQuery[`preferences.${key}`] = value;
      }
    }
  
    // Add other fields directly
    const directFields = [
      'bio',
      'gender',
      'age',
      'city',
      'course',
      'college',
      'primaryLanguage',
      'otherLanguage',
      'foodType',
      'hobbies',
    ];
    for (const field of directFields) {
      if (profileData[field] !== undefined) updateQuery[field] = profileData[field];
    }
  
    return await Profile.findOneAndUpdate(
      { userId },
      { $set: updateQuery },
      { new: true, runValidators: true }
    );
  };