import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const UpdateTaskForm: React.FC<{ taskId: string; onTaskUpdated: () => void }> = ({ taskId, onTaskUpdated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    // Fetch task details to pre-fill the form
    const fetchTask = async () => {
      try {
        const response = await axiosInstance.get(`/tasks/${taskId}`);
        const { title, description, dueDate } = response.data;
        setTitle(title);
        setDescription(description);
        setDueDate(new Date(dueDate).toISOString().split('T')[0]); // Format date for input
      } catch (error) {
        console.error('Error fetching task details:', error);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`/tasks/${taskId}`, { title, description, dueDate });
      onTaskUpdated(); // Notify parent of update
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 dark:bg-gray-700 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Update Task</h2>
      <div className="mb-4">
        <label className="block mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border rounded px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Update
      </button>
    </form>
  );
};

export default UpdateTaskForm;
