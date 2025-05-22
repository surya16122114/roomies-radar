import mongoose from 'mongoose';
const { Schema } = mongoose;



const PostSchema = new Schema({
  postId: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taggedRoommates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  address: {
    street: { type: String, required: true },
    apartmentNumber: { type: Number },
    city: { type: String, required: true },
    area: { type: String, required: true },
  },
  bedrooms: { type: Number, required: true, min: 0 },
  bathrooms: { type: Number, required: true, min: 0 },
  rent: { type: Number, required: true },
  deposit: { type: Number },
  description: { type: String, required: true },
  availableFrom: { type: Date, required: true },
  leaseDuration: { type: Number, required: true, min: 0 },
  spotType: {
    type: String,
    required: true,
    enum: ['Private Room', 'Shared Room', 'Private Hall', 'Shared Hall'],
  },
  photos: { type: [String] },
  amenities: {
    type: [String],
    enum: [
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
    ],
    required: true,
  },
  preferences: {
    foodPreferences: { type: String, enum: ['Veg', 'Non-Veg', 'Any'], required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Any'], required: true },
    drinking: { type: Boolean, required: true },
    smoking: { type: Boolean, required: true },
    anySpecialRequirements: { type: String },
  },
}, { timestamps: true });

// Create the Post model
const Post = mongoose.model('Post', PostSchema);

export default Post;  // ES6 export
