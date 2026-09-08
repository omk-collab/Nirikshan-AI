import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ['MINISTRY_ADMIN', 'STATE_AUTHORITY', 'DISTRICT_AUTHORITY', 'OFFICER', 'ANALYST'],
      default: 'ANALYST',
    },
    department: { type: String, default: 'Planning & Monitoring Division' },
    state: { type: String, default: 'National' },
    district: { type: String, default: 'All Districts' },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
    lastLogin: { type: Date, default: Date.now },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
export default User;
