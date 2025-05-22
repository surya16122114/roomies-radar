import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
    listingId: { type: String, required: true },
    address: {
        street: String,
        apartmentNumber: Number,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    price: { type: Number, required: true },
    description: String,
    availabilityDates: Date,
    roomType: String,
    photos: [String],
    amenities: [String],
    maxOccupants: Number,
    createdDate: Date
});

export default mongoose.model('Listing', ListingSchema);
