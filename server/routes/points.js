const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   PUT /api/points/update
// @desc    Update user points
// @access  Private
router.put('/update', protect, async (req, res) => {
  try {
    const { points } = req.body;
    
    if (points === undefined) {
      return res.status(400).json({ message: 'Points value is required' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.points = points;
    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      points: user.points,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/points
// @desc    Get user points
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ points: user.points });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;