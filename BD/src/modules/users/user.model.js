import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    role: {
      type: String,
      enum: ['customer', 'merchant', 'admin'],
      default: 'customer',
    },
  },
  { timestamps: true }
);

// FIXED: Removed 'next' completely. Modern Mongoose handles async/await automatically!
userSchema.pre('save', async function () {
  // If the password hasn't been modified, just return and let Mongoose continue
  if (!this.isModified('password')) {
    return;
  }
  
  // Hash the password securely
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;