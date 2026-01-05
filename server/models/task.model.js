const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * @desc    Mongoose schema for the Task model.
 *          defines the structure of a task document in the MongoDB database.
 */
const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  userId: { type: String, required: true },
}, {
  timestamps: true,
});

//create the task model from the schema.
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;