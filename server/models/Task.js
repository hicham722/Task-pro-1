const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  amount: { type: Number, default: 0 },
  dueDate: { type: String, required: true },
  status: { type: String, default: 'Upcoming' },
  notes: String,
  reminder: { type: Boolean, default: false },
  userId: String 
}, { timestamps: true });

// Convert _id to id for frontend compatibility
taskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model('Task', taskSchema);