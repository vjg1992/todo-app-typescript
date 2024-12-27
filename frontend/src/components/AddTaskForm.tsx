import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';


const AddTaskForm: React.FC<{ onTaskAdded: () => void }> = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/tasks', { title, description, dueDate });
      setTitle('');
      setDescription('');
      setDueDate('');
      onTaskAdded();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-900 shadow rounded mb-5">
      <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200">Add New Task</h2>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          placeholder="Enter task title"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          placeholder="Enter task description"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          placeholder="dd-mm-yyyy"
          required
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded dark:bg-blue-600"
      >
        Add Task
      </button>
    </form>
  );
};

export default AddTaskForm;
