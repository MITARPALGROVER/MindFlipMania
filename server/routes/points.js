const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/auth")
const User = require("../models/User")

// @route   GET api/points
// @desc    Get current user's points
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json({ points: user.points })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   PUT api/points/update
// @desc    Update user's points
// @access  Private
router.put("/update", protect, async (req, res) => {
  try {
    const { points } = req.body

    // Update user's points
    const user = await User.findByIdAndUpdate(req.user.id, { points }, { new: true }).select("-password")

    res.json({ points: user.points })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   GET api/points/leaderboard
// @desc    Get leaderboard (all users sorted by points)
// @access  Public
router.get("/leaderboard", async (req, res) => {
  try {
    // Get all users sorted by points in descending order
    const users = await User.find().select("username points").sort({ points: -1 }).limit(100) // Limit to top 100 users

    res.json(users)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router
