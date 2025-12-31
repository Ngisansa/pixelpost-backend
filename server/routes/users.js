const express = require("express");
const router = express.Router();

/**
 * TEMP / GUEST USER ENDPOINT
 * Required by frontend (/users/me)
 * Does NOT require authentication
 */
router.get('/me', authOptional, async (req, res) => {
  if (!req.user) {
    return res.json({
      id: 'guest',
      email: null,
      role: 'guest',
      credits: 0,
    });
  }

  const user = await User.findById(req.user.id);
  res.json(user);
});