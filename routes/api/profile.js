const express = require("express");
const router = express.Router();
const { checkAuth } = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator/check");

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

// @route GET api/profile/me
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

      let profile = Profile.findOne({
        user: req.user.id
      });
    //   profile.remove();
      if (profile) {
          console.log("Found Profile")
          profile = await Profile.findOneAndUpdate(
              { user: req.user.id},
              {$set: profileFields},
              {new:true}
          )
          return res.json(profile)
      }else{
          profile = new Profile(profileFields)
          profile.save()
          return res.json(profile)
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);
module.exports = router;
