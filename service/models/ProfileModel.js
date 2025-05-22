import mongoose from 'mongoose';
const { Schema } = mongoose;


const HOBBIES_ENUM = [
  "Reading",
  "Writing",
  "Cooking",
  "Traveling",
  "Gardening",
  "Gaming",
  "Photography",
  "Drawing",
  "Playing Musical Instruments",
  "Sports",
  "Others",
];

const ProfileSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to User model
  bio: { type: String },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  age: { type: Number },
  city: { type: String },
  course: { type: String },
  college: { type: String },
  primaryLanguage: { type: String },
  otherLanguage: { type: String },
  foodType: { type: String, enum: ["Veg", "Non-Veg", "Any"] },
  workExperience: {
    companyName: { type: String },
    role: { type: String },
    tenure: { type: String },
  },
  education: {
    school: { type: String },
    degree: { type: String },
    fieldOfStudy: { type: String },
  },
  hobbies: { type: [String], enum: HOBBIES_ENUM, default: [] },
  preferences: {
    foodPreferences: { type: String, enum: ['Veg', 'Non-Veg', 'Any'], required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Any'], required: true },
    drinking: { type: Boolean, required: true },
    smoking: { type: Boolean, required: true },
    anySpecialRequirements: { type: String },
  }
});

// Create the Profile model
const Profile = mongoose.model('Profile', ProfileSchema);

export default Profile;