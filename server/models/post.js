// server/models/post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  caption: { type: String, required: true },
  image: { type: String, default: '' },
  platforms: { type: [String], default: [] },
  scheduledAt: { type: Date, default: null },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published', 'failed'],
    default: 'draft'
  },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  author: { type: String, default: 'MobileUser' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} }
});

// FIXED pre-save hook
PostSchema.pre('save', function () {
  this.updatedAt = new Date();
});

module.exports = mongoose.model('Post', PostSchema);
