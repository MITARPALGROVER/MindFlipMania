const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/auth")
const User = require("../models/User")
const UserTheme = require("../models/userTheme")

// @route   GET api/themes
// @desc    Get user's themes
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    let userTheme = await UserTheme.findOne({ user: req.user.id })

    // If no theme record exists, create one with default theme
    if (!userTheme) {
      userTheme = new UserTheme({
        user: req.user.id,
        themes: [{ name: "default", purchased: true }],
        activeTheme: "default",
      })
      await userTheme.save()
    }

    res.json(userTheme)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   POST api/themes/purchase
// @desc    Purchase a theme
// @access  Private
router.post("/purchase", protect, async (req, res) => {
  try {
    const { themeName, price } = req.body

    // Get user to check points
    const user = await User.findById(req.user.id)

    // Check if user has enough points
    if (user.points < price) {
      return res.status(400).json({ msg: "Not enough coins" })
    }

    // Get or create user theme record
    let userTheme = await UserTheme.findOne({ user: req.user.id })
    if (!userTheme) {
      userTheme = new UserTheme({
        user: req.user.id,
        themes: [{ name: "default", purchased: true }],
        activeTheme: "default",
      })
    }

    // Check if theme is already purchased
    const themeIndex = userTheme.themes.findIndex((theme) => theme.name === themeName)
    if (themeIndex !== -1 && userTheme.themes[themeIndex].purchased) {
      return res.status(400).json({ msg: "Theme already purchased" })
    }

    // Add or update theme in user's themes
    if (themeIndex !== -1) {
      userTheme.themes[themeIndex].purchased = true
    } else {
      userTheme.themes.push({ name: themeName, purchased: true })
    }

    // Deduct points from user
    user.points -= price
    await user.save()

    // Save user theme
    await userTheme.save()

    res.json({
      userTheme,
      points: user.points,
      msg: "Theme purchased successfully",
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   PUT api/themes/activate
// @desc    Activate a theme
// @access  Private
router.put("/activate", protect, async (req, res) => {
  try {
    const { themeName } = req.body

    // Get user theme record
    const userTheme = await UserTheme.findOne({ user: req.user.id })
    if (!userTheme) {
      return res.status(404).json({ msg: "User theme record not found" })
    }

    // Check if theme is purchased
    const themeExists = userTheme.themes.some((theme) => theme.name === themeName && theme.purchased)

    if (!themeExists && themeName !== "default") {
      return res.status(400).json({ msg: "Theme not purchased" })
    }

    // Set active theme
    userTheme.activeTheme = themeName
    await userTheme.save()

    res.json({
      activeTheme: themeName,
      msg: "Theme activated successfully",
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router
