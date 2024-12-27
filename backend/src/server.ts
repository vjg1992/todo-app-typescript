import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cron from 'node-cron';
import taskRoutes from './taskRoutes';
import notifier from 'node-notifier';

dotenv.config();

const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/tasks', taskRoutes);

// Cron Job for Due Tasks
cron.schedule('0 8 * * *', async () => {
  try {
    console.log('Running Task Notification Job...');
    const upcomingTasks = await mongoose.model('Task').find({
      dueDate: { $lte: new Date(Date.now() + 24 * 60 * 60 * 1000) }, // Tasks due within 24 hours
      status: { $ne: 'Completed' },
    });

    if (upcomingTasks.length > 0) {
      upcomingTasks.forEach((task) => {
        notifier.notify({
          title: 'Task Reminder',
          message: `Task "${task.title}" is due soon!`,
        });
      });
      console.log('Notifications sent for upcoming tasks.');
    } else {
      console.log('No upcoming tasks found.');
    }
  } catch (error) {
    console.error('Error in Task Notification Job:', error);
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
