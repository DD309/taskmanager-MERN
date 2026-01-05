const router = require('express').Router();
let Task = require('../models/task.model');
const auth = require('../middleware/auth');

/**
 * @route   GET /tasks/
 * @desc    get all tasks for the currently logged in user
 * @access  private
 */
router.route('/').get(auth, async (req, res) => {
  //auth verifies token and attaches the users id to req.user
  //finds all tasks where user id matches logged in users id
  const tasks = await Task.find({ userId: req.user });
  res.json(tasks);
});

/**
 * @route   POST /tasks/add
 * @desc    add a new task for the logged in user
 * @access  private
 */
router.route('/add').post(auth, (req, res) => {
  const { title, description, status } = req.body;
  const userId = req.user; //get the user id from the authenticated token

  const newTask = new Task({
    title,
    description,
    status,
    userId,
  });

  newTask.save()
    .then(() => res.json('Task added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * @route   GET /tasks/:id
 * @desc    get a specific task by its id, checks if belongs to the user
 * @access  Private
 */
router.route('/:id').get(auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user });
    if (!task) {
      return res.status(404).json({ msg: 'Task not found or user not authorized' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   DELETE /tasks/:id
 * @desc    delete a specific task by its id, checks if belongs to the user
 * @access  Private
 */
router.route('/:id').delete(auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user });
    if (!task) {
      return res.status(404).json({ msg: 'Task not found or user not authorized' });
    }
    res.json({ msg: 'Task deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   POST /tasks/update/:id
 * @desc    update a specific task by its id, checks if belongs to the user
 * @access  Private
 */
router.route('/update/:id').post(auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    //check if the tasks user id matches the logged in users id
    if (task.userId.toString() !== req.user) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    task.title = req.body.title;
    task.description = req.body.description;
    task.status = req.body.status;

    await task.save();
    res.json({ msg: 'Task updated!' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;