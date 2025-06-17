const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/pintrest");

let userSchema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  profileImg: Buffer,
  contact: Number,
  boards: {
    type: Array,
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
});

module.exports = mongoose.model("user", userSchema);
