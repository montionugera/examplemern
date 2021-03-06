const mongoose = require("mongoose");
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      from: {
        type: Date
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      }
    }
  ],

  education: [
    {
      school: {
        type: String,
        required: true
      },
      feildofstudy: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      from: {
        type: Date
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      }
    }
  ],
  social: {
      youtube:{
        type: String,
      },
      facebook:{
        type: String,
      },
      twitter:{
        type: String,
      },
      instagram:{
        type: String,
      },
  },
  date: {
    type: Date,
    default: Date.now
  }
});
Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;
