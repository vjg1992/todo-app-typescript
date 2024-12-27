import express from 'express';
import notifier from 'node-notifier';
import Task from './taskModel';

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Get all tasks
router.get('/:id', async (req, res) => {
  try {
    const tasks = await Task.findById(req.params.id);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Add a new task
router.post('/', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Update task status
router.patch('/:id', async (req, res) => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status, 
          title: req.body.title,
          description: req.body.description,
          dueDate:req.body.dueDate,
        },
        { new: true } // Return the updated task
      );
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });
  
//Delete task
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(
      req.params.id,
      { status: req.body.status }); // Delete the task
    if (!deletedTask) {
      res.status(404).json({ message: 'Task not found' }); 
      return;
    }

    res.status(200).json({ message: 'Task deleted successfully' }); 
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: 'Error deleting task', error: err.message }); 
  }
});
  
  //Notifications
  router.get('/notifications/test', async (req, res) => {
    try {
      const upcomingTasks = await Task.find({
        dueDate: { $lte: new Date(Date.now() + 24 * 60 * 60 * 1000) },
        status: { $ne: 'Completed' },
      });
  
      upcomingTasks.forEach((task) => {
        notifier.notify({
          title: 'Task Reminder',
          message: `Task "${task.title}" is due soon!`,
        });
      });
  
      res.status(200).json({ message: 'Test notifications sent.' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

export default router;
