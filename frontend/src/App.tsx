import React, { useEffect, useState } from 'react';
import axiosInstance from './api/axiosInstance';
import AddTaskForm from './components/AddTaskForm';
import UpdateTaskForm from './components/UpdateTaskForm';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  dueDate: string;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      fetchTasks(); // Refresh task list
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };


  useEffect(() => {
    fetchTasks();

    // Request notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Browser notifications enabled.');
        } else {
          console.warn('Browser notifications denied.');
        }
      });
    }
  }, []);

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterStatus ? task.status === filterStatus : true)
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'} flex items-center justify-center p-5`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2 bg-blue-500 text-white rounded dark:bg-blue-600"
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>

      {/* Content Wrapper */}
      <div className="max-w-[800px] w-full bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-500 dark:text-blue-300 mb-6 text-center">ToDoApp Tasks</h1>
        <AddTaskForm onTaskAdded={fetchTasks} />

        {/* Update Task Form */}
        {editingTaskId && (
          <UpdateTaskForm
            taskId={editingTaskId}
            onTaskUpdated={() => {
              setEditingTaskId(null); // Close the edit form
              fetchTasks(); // Refresh the task list
            }}
          />
        )}

        {/* Search and Filter */}
        <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 border rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Task List */}
        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className="p-4 bg-gray-50 dark:bg-gray-700 shadow-sm rounded flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold dark:text-gray-200">{task.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{task.description}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Due: {new Date(task.dueDate).toDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setEditingTaskId(task._id)}
                  className="ml-4 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-gray-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 dark:text-gray-200"
                >
                  Delete
                </button>
                <select
                  value={task.status}
                  onChange={async (e) => {
                    try {
                      await axiosInstance.patch(`/tasks/${task._id}`, {
                        status: e.target.value,
                      });
                      fetchTasks();
                    } catch (error) {
                      console.error('Error updating task status:', error);
                    }
                  }}
                  className="p-1 border rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
