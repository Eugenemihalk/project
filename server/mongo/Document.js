const mongoose = require('mongoose');
const participantSchema = new mongoose.Schema({
  email: { type: String, required: true, trim: true, lowercase: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  role: { type: String, enum: ['editor', 'viewer'], default: 'editor' },
});
const commentSchema = new mongoose.Schema({
  author: { type: String, required: true, trim: true },
  text: { type: String, required: true, trim: true },
  resolved: { type: Boolean, default: false },
}, { timestamps: true });
const documentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  tags: [{ type: String, trim: true }],
  participants: [participantSchema],
  comments: [commentSchema],
}, { timestamps: true });
documentSchema.index({ tags: 1 });
documentSchema.index({ 'participants.email': 1 });
module.exports = mongoose.model('CollaborativeDocument', documentSchema, 'documents');
