import mongoose from 'mongoose';

const PreferencesSchema = new mongoose.Schema({
    foodPreferences: { type: String, enum: ['Veg', 'Non-Veg', 'Any'],required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Any'], required: true},
    drinking: { type: Boolean, required: true },
    smoking: { type: Boolean, required: true },
    anySpecialRequirements: { type: String }
});

export default mongoose.model('Preferences', PreferencesSchema);
