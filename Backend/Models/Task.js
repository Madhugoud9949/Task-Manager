const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed'], // Define valid status values here
    required: true 
  },
  category: String,
  deadline: Date,
  priority: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
