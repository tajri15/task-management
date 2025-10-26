import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import TaskModal from '../components/TaskModal';

const Dashboard = () => {
  const { user, logout } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = filterStatus !== 'All' ? { status: filterStatus } : {};
      const response = await api.get('/tasks', { params });
      setTasks(response.data);
    } catch (error) {
      console.error('Gagal mengambil tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus task ini?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        fetchTasks();
      } catch (error) {
        console.error('Gagal menghapus task:', error);
      }
    }
  };

  const handleTaskSaved = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
    fetchTasks();
  };

  const getStatusColor = (status) => {
    const colors = {
      'Done': 'bg-green-100 text-green-800 border-green-200',
      'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'To Do': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || colors['To Do'];
  };

  const renderTaskCards = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (tasks.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <p className="text-gray-600 text-lg">Belum ada task</p>
          <p className="text-gray-500">Silakan buat task baru untuk memulai</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div 
            key={task.task_id} 
            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
                  {task.title}
                </h3>
                <span 
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)} whitespace-nowrap`}
                >
                  {task.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {task.description || 'Tidak ada deskripsi.'}
              </p>
              
              {task.deadline && (
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="w-4 h-4 mr-2">⏰</span>
                  <span>{new Date(task.deadline).toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => handleOpenEditModal(task)}
                  className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.task_id)}
                  className="px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Hi, {user?.name || 'User'}! 👋
              </h1>
              <p className="text-gray-600">Kelola task dan produktivitas Anda</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Filter Status:
            </label>
            <select
              id="statusFilter"
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">Semua Task</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          
          <button
            onClick={handleOpenCreateModal}
            className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>+</span>
            <span>Tambah Task Baru</span>
          </button>
        </div>

        {/* Content */}
        <main>
          {renderTaskCards()}
        </main>

        {/* Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTaskSaved={handleTaskSaved}
          taskToEdit={taskToEdit}
        />
      </div>
    </div>
  );
};

export default Dashboard;