import { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api';
import { useSocket } from '../context/socket';
import { FiPlus, FiTrash2, FiCheckSquare, FiSquare, FiRefreshCw, FiFilter } from 'react-icons/fi';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '' });
  const [loading, setLoading] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const socket = useSocket();

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleCreated = (task) => {
      setTasks(prev => [task, ...prev]);
    };

    const handleUpdated = (updatedTask) => {
      setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
    };

    const handleDeleted = (taskId) => {
      setTasks(prev => prev.filter(t => t._id !== taskId));
    };

    socket.on('task:created', handleCreated);
    socket.on('task:updated', handleUpdated);
    socket.on('task:deleted', handleDeleted);

    return () => {
      socket.off('task:created', handleCreated);
      socket.off('task:updated', handleUpdated);
      socket.off('task:deleted', handleDeleted);
    };
  }, [socket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    try {
      await createTask(newTask);
      setNewTask({ title: '' });
      // No need to reload, socket will handle it
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await updateTask(task._id, { status: newStatus });
      // Socket will update the UI
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
      // Socket will update the UI
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter(t => showCompleted || t.status !== 'completed');

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-white flex-col">
      {/* Toolbar */}
      <div className="h-10 border-b border-gray-200 flex items-center px-4 bg-gray-50 justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-700">Tasks</span>
          <div className="h-4 w-px bg-gray-300"></div>
          <button 
            onClick={() => setShowCompleted(!showCompleted)}
            className={`text-sm flex items-center gap-1 ${showCompleted ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <FiFilter size={14} /> {showCompleted ? 'Hide Completed' : 'Show Completed'}
          </button>
        </div>
        <button onClick={loadTasks} className="text-gray-500 hover:text-gray-700" title="Refresh">
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Quick Add */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <FiPlus className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Add a new task..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            disabled={!newTask.title.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Add Task
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto bg-white p-4">
        <div className="max-w-3xl mx-auto space-y-2">
          {filteredTasks.length === 0 && !loading ? (
            <div className="text-center py-10 text-gray-400">
              <FiCheckSquare size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No tasks found</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task._id} 
                className={`group flex items-center gap-3 p-3 rounded border transition-all ${
                  task.status === 'completed' ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <button 
                  onClick={() => toggleTaskStatus(task)}
                  className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    task.status === 'completed' ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-400 hover:border-blue-500 text-transparent'
                  }`}
                >
                  <FiCheckSquare size={14} />
                </button>
                
                <span className={`flex-1 ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {task.title}
                </span>

                <button 
                  onClick={() => handleDelete(task._id)}
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
