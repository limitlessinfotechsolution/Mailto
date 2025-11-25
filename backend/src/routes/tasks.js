import express from 'express';
import { Task } from '@mailo/shared';
import { auth } from '../middleware/auth.js';
import { getIO } from '../socket.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user._id
    });
    await task.save();
    
    // Emit real-time event
    getIO().to(req.user._id.toString()).emit('task:created', task);
    
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    // Emit real-time event
    getIO().to(req.user._id.toString()).emit('task:updated', task);
    
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    // Emit real-time event
    getIO().to(req.user._id.toString()).emit('task:deleted', task._id);
    
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
