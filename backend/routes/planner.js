const express = require('express');
const { readTasks, writeTasks } = require('../utils/fileOperations');
const { getNextTaskId } = require('../utils/helpers');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get tasks
router.get('/', authenticateToken, async (req, res) => {
  console.log('GET /api/tasks called');
  try {
    const { date } = req.query;
    const userId = req.user.id;
    const tasks = await readTasks();

    if (!tasks[userId]) {
      tasks[userId] = {};
    }

    if (date) {
      const dateTasks = tasks[userId][date] || [];
      res.json({ tasks: dateTasks });
    } else {
      res.json({ tasks: tasks[userId] || {} });
    }
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create task
router.post('/', authenticateToken, async (req, res) => {
  console.log('POST /api/tasks called');
  try {
    const { date, title } = req.body;
    const userId = req.user.id;

    if (!date || !title) {
      return res.status(400).json({ error: 'Date and title are required' });
    }

    const tasks = await readTasks();

    if (!tasks[userId]) {
      tasks[userId] = {};
    }

    if (!tasks[userId][date]) {
      tasks[userId][date] = [];
    }

    // Get next sequential ID for this user/date
    const nextId = getNextTaskId(tasks[userId][date]);

    const newTask = {
      id: nextId,
      title: title.trim(),
      status: 'pending',
      order: tasks[userId][date].length,
      createdAt: new Date().toISOString(),
    };

    tasks[userId][date].push(newTask);
    await writeTasks(tasks);

    console.log(`Task created: userId=${userId}, date=${date}, taskId=${newTask.id}`);
    res.json({ success: true, task: newTask });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task
router.put('/:taskId', authenticateToken, async (req, res) => {
  console.log(`PUT /api/tasks/${req.params.taskId} called`);
  try {
    const { taskId } = req.params;
    const { date, title, status } = req.body;
    const userId = req.user.id;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const tasks = await readTasks();

    if (!tasks[userId] || !tasks[userId][date]) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Ensure string comparison for task IDs
    const taskIndex = tasks[userId][date].findIndex(t => String(t.id) === String(taskId));

    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (title !== undefined) {
      tasks[userId][date][taskIndex].title = title.trim();
    }

    if (status && ['pending', 'completed'].includes(status)) {
      tasks[userId][date][taskIndex].status = status;
    }

    await writeTasks(tasks);

    res.json({ success: true, task: tasks[userId][date][taskIndex] });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete task
router.delete('/:taskId', authenticateToken, async (req, res) => {
  console.log(`DELETE /api/tasks/${req.params.taskId} called`);
  try {
    const { taskId } = req.params;
    const { date } = req.query;
    const userId = req.user.id;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const tasks = await readTasks();

    if (!tasks[userId] || !tasks[userId][date]) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Ensure string comparison for task IDs
    tasks[userId][date] = tasks[userId][date].filter(t => String(t.id) !== String(taskId));
    await writeTasks(tasks);

    res.json({ success: true });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

