"use strict";

const express = require("express");
const { login, registerUser } = require("../utils/helper");

const router = express.Router();

/**
 * Hospital Login
 */
router.post("/login", async (req, res) => {
  try {
    const { userId, userRole } = req.body;
    console.log("userId: ", userId);
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    // Try to login, if not found, onboard
    let loginRes = await login(userId, userRole);
    console.log("loginRes: ", loginRes);
    res.json(loginRes);
  } catch (error) {
    console.error("Hospital login error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
