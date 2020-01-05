const express = require("express");
const router = express.Router();
const { checkAuth } = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");

// @route GET api/profile/user/:user_id
// @desc get Profile by user ID
// @access Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "email", "avatar"]);

    if (!profile) {
      const error = "profile not exist.";
      return res.status(400).json({ errors: { msg: error } });
    }
    res.json(profile);
    return;
  } catch (error) {
    console.log(error.message);
    if (error.kind == "ObjectId")
      return res.status(404).json({ errors: { msg: "Object not found" } });

    res.status(500).send(error.message);
  }
  res.send("profile route");
});

// @route GET api/profile/me
// @desc Test route
// @access Public

router.get("/me", checkAuth, async (req, res) => {
  try {
    console.log(req.user.id);
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "email", "avatar"]);

    if (!profile) {
      const error = "profile not exist.";
      return res.status(400).json({ errors: { msg: error } });
    }
    res.json(profile);
    return;
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
  res.send("profile route");
});

// @route POST api/profile/
// @desc Test route
// @access Public

router.post(
  "/",
  [
    checkAuth,
    [
      check("status", "Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      status,
      bio,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram
    } = req.body;

    try {
      let profileFields = {};
      profileFields.user = req.user.id;

      if (company) profileFields.company = company;
      if (website) profileFields.website = website;
      if (location) profileFields.location = location;
      if (status) profileFields.status = status;
      if (bio) profileFields.bio = bio;
      if (githubusername) profileFields.githubusername = githubusername;
      if (skills) {
        profileFields.skills = skills.split(",").map(item => item.trim());
      }
      profileFields.social = {};
      if (youtube) profileFields.social.youtube = youtube;
      if (facebook) profileFields.social.facebook = facebook;
      if (twitter) profileFields.social.twitter = twitter;
      if (instagram) profileFields.social.instagram = instagram;

      let profile = await Profile.findOne({
        user: req.user.id
      });
      //   profile.remove();
      if (profile) {
        console.log("Found Profile");
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        console.log(profile);
        return res.json(profile);
      } else {
        profile = new Profile(profileFields);
        profile.save();
        return res.json(profile);
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route DELEtE api/profile/
// @desc DELETE profile and User
// @access Owner (x-auth-token)
router.delete("/", checkAuth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({
      user: req.user.id
    });
    await User.findOneAndRemove({
      _id: req.user.id
    });
    res.json({ msg: "User is deleted" });
    return;
  } catch (error) {
    console.log(error.message);
    if (error.kind == "ObjectId")
      return res.status(404).json({ errors: { msg: "Object not found" } });

    res.status(500).send(error.message);
  }
  res.send("profile route");
});

// @route PUT api/profile/experience"
// @desc Create profile's experience
// @access Owner (x-auth-token)
router.put(
  "/experience",
  [
    checkAuth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };
    try {
      let profile = await Profile.findOne({
        user: req.user.id
      });
      profile.experience.unshift(newExp);
      profile = await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route DELETE api/profile/experience/:expId"
// @desc Create profile's experience
// @access Owner (x-auth-token)
router.delete("/experience/:expId", checkAuth, async (req, res) => {
  try {
    profile = await Profile.findOne({
      user: req.user.id
    });
    profile.experience = profile.experience.filter(
      item => item._id !== req.params.expId
    );
    profile = await profile.save();
    res.json({ profile });
    return;
  } catch (error) {
    console.log(error.message);
    if (error.kind == "ObjectId") {
      return res.status(404).json({ errors: { msg: "Object not found" } });
    }
    res.status(500).send(error.message);
  }
  res.send("profile route");
});
module.exports = router;
