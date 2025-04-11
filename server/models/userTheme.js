const mongoose = require("mongoose")

const UserThemeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  themes: [
    {
      name: {
        type: String,
        required: true,
      },
      purchased: {
        type: Boolean,
        default: false,
      },
    },
  ],
  activeTheme: {
    type: String,
    default: "default",
  },
})

module.exports = mongoose.model("userTheme", UserThemeSchema)
