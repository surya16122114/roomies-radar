import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;


/**
 * Register user schema.
 * Fetches all request information for a specific user.
 *
 * @param {Object} request - The HTTP request firstname, lastname, DOB,email, password, confirmPassword.
 * @param {Object} response - The HTTP response object.
 */



// const UserProfileSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserSchema', required: true },
    
// }, { timestamps: true });



const UserSchema = Schema({
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    DOB:{
        type: String, 
        required: false
    },
    PhoneNumber:{
        type: String,
        required: false        
    },
    email: {
        type: String,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Email format is invalid'],
        lowercase: true,
    },
    password: {
        type: String,
        minlength: 8
    },
    membership:  { type: mongoose.Schema.Types.ObjectId, ref: 'Membership', required:false },
    createdAt: {
        type: Date,
        required: false ,
        default: Date.now,
    },
    
},
// {
//         collation : 'users'
//     }
);


UserSchema.pre('save', function (next) {
    if (this.isModified('password') && this.password) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    }
    next();
  });
  
  UserSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
  
    if (update.password) {
      update.password = bcrypt.hashSync(update.password, bcrypt.genSaltSync(10));
    } else {
      // Skip password hashing if no password is provided in the update
      delete update.password;
    }
    
    next();
  });
  

export const User = mongoose.model('User', UserSchema);
