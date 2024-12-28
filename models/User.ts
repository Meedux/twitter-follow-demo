import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  twitterId: String,
  twitterHandle: String,
  targetId: String,
  followStatus: Boolean,
  timestamp: Date
});

export default mongoose.models.User || mongoose.model('User', UserSchema);