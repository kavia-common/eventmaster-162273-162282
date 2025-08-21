const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

UserSchema.methods.comparePassword = async function comparePassword(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

UserSchema.statics.hashPassword = async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

module.exports = mongoose.model('User', UserSchema);
