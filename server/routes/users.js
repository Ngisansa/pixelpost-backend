const express = require("express");
const router = express.Router();

/**
 * OPTIONAL AUTH MIDDLEWARE
 * If Authorization header exists → attach user
 * If not → continue as guest
 */
function authOptional(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = null;
    return next();
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    // ⚠️ TEMP: no JWT validation yet
    // When JWT is added, decode & verify here
    req.user = { id: token };
  } catch (err) {
    req.user = null;
  }

  next();
}

/**
 * GET /users/me
 * Required by frontend
 * Safe for production (guest fallback)
 */
router.get("/me", authOptional, async (req, res) => {
  try {
    // Guest user
    if (!req.user) {
      return res.json({
        id: "guest",
        email: null,
        role: "guest",
        credits: 0,
      });
    }

    // 🔐 Authenticated user (future-ready)
    // NOTE: Only used once real JWT + User model exist
    const User = require("../models/User");
    const user = await User.findById(req.user.id).select(
      "_id email role credits"
    );

    if (!user) {
      return res.json({
        id: "guest",
        email: null,
        role: "guest",
        credits: 0,
      });
    }

    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      credits: user.credits,
    });
  } catch (err) {
    console.error("❌ /users/me error:", err);
    res.status(500).json({ error: "Failed to load user profile" });
  }
});

module.exports = router;
