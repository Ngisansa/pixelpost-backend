const express = require("express");
const router = express.Router();

/**
 * TEMP / GUEST USER ENDPOINT
 * Required by frontend (/users/me)
 * Does NOT require authentication
 */
router.get("/me", (req, res) => {
  res.json({
    id: "guest",
    email: null,
    role: "guest",
    credits: 0,
  });
});

module.exports = router;
