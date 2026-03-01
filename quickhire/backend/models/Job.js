const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Design', 'Sales', 'Marketing', 'Finance', 'Technology', 'Engineering', 'Business', 'Human Resources'],
    },
    type: {
      type: String,
      required: [true, 'Job type is required'],
      enum: ['Full Time', 'Part Time', 'Remote', 'Contract'],
      default: 'Full Time',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    salary: {
      type: String,
      default: 'Competitive',
    },
    logo: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
jobSchema.index({ title: 'text', company: 'text', description: 'text' });

module.exports = mongoose.model('Job', jobSchema);
