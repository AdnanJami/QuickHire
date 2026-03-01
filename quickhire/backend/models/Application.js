const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    resume_link: {
      type: String,
      required: [true, 'Resume link is required'],
      match: [/^https?:\/\/.+/, 'Please enter a valid URL starting with http:// or https://'],
    },
    cover_note: {
      type: String,
      required: [true, 'Cover note is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Application', applicationSchema);
