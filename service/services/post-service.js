import Post from '../models/Post.js';
import {User} from '../models/UserModel.js';

// Custom Error Classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

export const getAllPosts = async (query) => {
  try {
    const {
      city,
      area,
      minPrice,
      maxPrice,
      roomType,
      leaseDuration,
      amenities,
      gender,
      foodPreferences,
      availableFrom,
      page = 1, // Default page
      limit = 10, // Default limit
    } = query;

    const queryObj = {};

    // Add filters to the query object
    if (city) queryObj['address.city'] = { $regex: new RegExp(city, 'i') };
    if (area) queryObj['address.area'] = { $regex: new RegExp(area, 'i') };
    if (minPrice) queryObj.rent = { $gte: +minPrice };
    if (maxPrice) queryObj.rent = { ...queryObj.rent, $lte: +maxPrice };
    if (roomType) queryObj.spotType = { $regex: new RegExp(`^${roomType}$`, 'i') };
    if (leaseDuration) queryObj.leaseDuration = { $gte: +leaseDuration };

    // Handle amenities filter
    if (Array.isArray(amenities) && amenities.length > 0) {
      queryObj.amenities = { $all: amenities };
    } else if (typeof amenities === 'string') {
      queryObj.amenities = { $all: amenities.split(',') };
    }

    // Add gender and foodPreferences filters
    if (gender) queryObj['preferences.gender'] = gender;
    if (foodPreferences) queryObj['preferences.foodPreferences'] = foodPreferences;

    // Handle date filter
    if (availableFrom && !isNaN(Date.parse(availableFrom))) {
      queryObj['availableFrom'] = { $gte: new Date(availableFrom) };
    }

    // Calculate skip and limit
    const skip = (page - 1) * limit;

    console.log('Generated Query Object:', JSON.stringify(queryObj, null, 2));

    // Fetch posts matching the query with pagination
    const posts = await Post.find(queryObj)
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'firstName lastName email')
      .populate('taggedRoommates', 'firstName lastName email');

    const totalPosts = await Post.countDocuments(queryObj);

    console.log('Number of Posts Found:', posts.length);

    return {
      posts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    };
  } catch (error) {
    console.error(`[Error] getAllPosts: ${error.message}`, error);
    throw new Error('Failed to fetch posts. Please try again later.');
  }
};







// Get a single post by postId
export const getPostById = async (postId) => {
  try {
    const post = await Post.findOne({ postId })
      .populate('createdBy', 'firstName lastName email')
      .populate('taggedRoommates', 'firstName lastName email');
    if (!post) throw new NotFoundError('Post not found');
    return post;
  } catch (error) {
    console.error(`[Error] getPostById: ${error.message}`, error);
    throw error;
  }
};


export const createPost = async (postData) => {
  try {
    const {
      createdBy,
      taggedRoommates = [], // Optional field, default to an empty array
      photos = [], // Optional field, default to an empty array
      amenities = [], // Optional field, default to an empty array
    } = postData;

    // Validate `createdBy` field
    const creator = await User.findById(createdBy);
    if (!creator) {
      throw new Error('Creator user not found.');
    }

    // Validate `taggedRoommates` field (if provided)
    if (taggedRoommates.length > 0) {
      const validRoommates = await User.find({ _id: { $in: taggedRoommates } });
      if (validRoommates.length !== taggedRoommates.length) {
        throw new Error('One or more tagged roommates do not exist.');
      }
    }

    // Validate `photos` field
    if (!Array.isArray(photos)) {
      throw new Error('Photos must be an array of strings.');
    }

    // Validate `amenities` field
    const allowedAmenities = [
      'In-unit laundry',
      'Unfurnished',
      'Furnished',
      'Furnish Optional',
      'Private bath',
      'Free Wifi',
      'Large closet',
      'Balcony',
      'Doorman',
      'Free parking',
      'Paid parking',
      'Outdoor space',
      'Handicap accessible',
      'Security system',
    ];
    const invalidAmenities = amenities.filter((amenity) => !allowedAmenities.includes(amenity));
    if (invalidAmenities.length > 0) {
      throw new Error(`Invalid amenities provided: ${invalidAmenities.join(', ')}`);
    }

    // Generate a unique `postId`
    const postId = generateShortId();

    // Prepare the post data
    const postWithId = {
      ...postData,
      postId,
      taggedRoommates,
      photos,
      amenities,
    };

    // Save the post
    const post = new Post(postWithId);
    await post.save();

    // Populate the created post
    const populatedPost = await Post.findById(post._id)
      .populate('createdBy', 'firstName lastName email')
      .populate('taggedRoommates', 'firstName lastName email');

    return populatedPost;
  } catch (error) {
    console.error(`[Error] createPost: ${error.message}`);
    throw error;
  }
};



// Update an existing post
export const updatePost = async (postId, updateData) => {
  try {
    const updateQuery = {};

    // Flatten updates for nested fields
    if (updateData.address) {
      for (const [key, value] of Object.entries(updateData.address)) {
        updateQuery[`address.${key}`] = value;
      }
    }
    if (updateData.preferences) {
      for (const [key, value] of Object.entries(updateData.preferences)) {
        updateQuery[`preferences.${key}`] = value;
      }
    }

    // Include all other fields directly
    const directFields = ['bedrooms', 'bathrooms', 'rent', 'deposit', 'description', 'availableFrom', 'leaseDuration', 'spotType', 'photos', 'amenities'];
    for (const field of directFields) {
      if (updateData[field] !== undefined) updateQuery[field] = updateData[field];
    }

    const updatedPost = await Post.findOneAndUpdate(
      { postId },
      { $set: updateQuery },
      { new: true, runValidators: true }
    );

    if (!updatedPost) throw new NotFoundError('Post not found');
    return updatedPost;
  } catch (error) {
    console.error(`[Error] updatePost: ${error.message}`, error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    const post = await Post.findOneAndDelete({ postId });
    if (!post) throw new NotFoundError(`Post with ID ${postId} not found`);
    return post;
  } catch (error) {
    console.error(`[Error] deletePost: ${error.message}`, error);
    throw error;
  }
};

// Service function to get posts by user ID
export const getPostsByUserId = async (userId) => {
  try {
    const posts = await Post.find({ createdBy: userId })
      .populate('createdBy', 'firstName lastName  email')
      .populate('taggedRoommates', 'firstName lastName  email');
    if (!posts || posts.length === 0) throw new NotFoundError('No posts found for this user');
    return posts;
  } catch (error) {
    console.error(`[Error] getPostsByUserId: ${error.message}`, error);
    throw error;
  }
};

// Helper function to generate a unique `postId`
const generateShortId = () => {
  const timestamp = Date.now().toString(36); // Base-36 timestamp
  const random = Math.random().toString(36).substring(2, 8); // Random alphanumeric string
  return `${timestamp}-${random}`;
};
