import { Router } from 'express';
import { Task } from '../models/Task.js';
import { taskQueue } from '../queue/worker.js';

export const taskRouter = Router();

taskRouter.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

taskRouter.post('/', async (req, res) => {
  try {
    const { title, category, urgency, location, description } = req.body;
    
    const newTask = new Task({ title, category, urgency, location, description });
    await newTask.save();
    
    // Add job to BullMQ
    await taskQueue.add('process-need', { taskId: newTask._id.toString() });
    
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

taskRouter.post('/process-unstructured', async (req, res) => {
  try {
    const { text } = req.body;
    // Push the unstructured text parsing to the queue
    const job = await taskQueue.add('process-need', { rawText: text });
    res.status(202).json({ jobId: job.id, message: "Processing started" });
  } catch (error) {
    res.status(500).json({ error: "Failed to queue unstructured parsing" });
  }
});
