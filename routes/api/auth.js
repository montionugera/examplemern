const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { checkAuth } = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");

// @route GET api/auth
// @desc Test route
// @access Public

router.get("/", checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

// @route POST api/auth
// @desc login
// @access Public

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      const error = "Email not found.";
      return res.status(400).json({ errors: [{ msg: error }] });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(user.id);
      const error = "Invalid Password.";
      return res.status(400).json({ errors: [{ msg: error }] });
    }
    const payload = {
      user: {
        id: user.id
      }
    };
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      {
        expiresIn: config.get("jwtExpireIn")
      },
      (err, token) => {
        if (err) throw err;
        return res.json({ token });
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

module.exports = router;
