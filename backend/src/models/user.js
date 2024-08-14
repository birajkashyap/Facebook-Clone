// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  img: {
    data: Buffer,
    contentType: String,
  },
  bio: String,
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
