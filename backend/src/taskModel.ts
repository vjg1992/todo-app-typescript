import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: number;
  dueDate: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    priority: { type: Number, default: 1 },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>('Task', TaskSchema);
export default Task;
