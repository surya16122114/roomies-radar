import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch posts with filters and pagination
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({
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
    page = 1,
    limit = 10,
  }: {
    city?: string;
    area?: string;
    minPrice?: number;
    maxPrice?: number;
    roomType?: string;
    leaseDuration?: number;
    amenities?: string[];
    gender?: string;
    foodPreferences?: string;
    availableFrom?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await axios.get('${process.env.REACT_APP_API_URL}/posts', {
      params: {
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
        page,
        limit,
      },
    });
    return response.data;
  }
);

// Async thunk to create a new post
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData: any) => {
    const response = await axios.post('${process.env.REACT_APP_API_URL}/posts', postData);
    return response.data;
  }
);

// Async thunk to update a post
export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, postData }: { postId: string; postData: any }) => {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/posts/${postId}`, postData);
    return response.data;
  }
);

// Initial state for the slice
const initialState = {
  items: [] as any[], // List of posts
  loading: false, // Loading state for API calls
  error: null as string | null, // Error state
  currentPage: 1, // Current page for pagination
  totalPages: 0, // Total number of pages
  totalPosts: 0, // Total number of posts
};

// Create the post slice
const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    resetFilters: (state) => {
      state.items = [];
      state.currentPage = 1;
      state.totalPages = 0;
      state.totalPosts = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.posts;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalPosts = action.payload.totalPosts;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch posts';
      })
      // Handle createPost
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [action.payload, ...state.items];
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to create post';
      })
      // Handle updatePost
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPostIndex = state.items.findIndex((post) => post._id === action.payload._id);
        if (updatedPostIndex !== -1) {
          state.items[updatedPostIndex] = action.payload; // Update the post in the state
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to update post';
      });
  },
});

// Export actions and the reducer
export const { resetFilters } = postSlice.actions;
export default postSlice.reducer;
