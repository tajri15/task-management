import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import TaskModal from '../components/TaskModal';

function Dashboard() {
  const { user, logout } = useAuth();
  
  // State untuk data
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk UI
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Fungsi untuk mengambil data task dari API
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
        
      const params = {};
      if (filterStatus !== 'All') {
        params.status = filterStatus;
      }

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

  const renderTaskCards = () => {
    if (isLoading) {
      return <p className="text-gray-600">Loading tasks...</p>;
    }

    if (tasks.length === 0) {
      return <p className="text-gray-600">Belum ada task. Silakan buat task baru.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task.task_id} className="p-5 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
              <span 
                className={`px-3 py-1 text-xs font-medium rounded-full
                  ${task.status === 'Done' ? 'bg-green-100 text-green-800' : ''}
                  ${task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${task.status === 'To Do' ? 'bg-gray-100 text-gray-800' : ''}
                `}
              >
                {task.status}
              </span>
            </div>
            <p className="text-gray-600 mt-2 break-words">
              {task.description || 'Tidak ada deskripsi.'}
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Deadline: {task.deadline ? new Date(task.deadline).toLocaleString() : 'N/A'}
            </p>
            {/* Tombol Aksi per Task */}
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                onClick={() => handleOpenEditModal(task)}
                className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded hover:bg-blue-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTask(task.task_id)}
                className="px-3 py-1 text-sm text-red-600 bg-red-100 rounded hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header Utama */}
      <header className="flex flex-col md:flex-row justify-between items-center pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">
          Hi, {user?.name || 'User'}!
        </h1>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <p className="text-sm text-gray-600 hidden md:block">{user?.email}</p>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Kontrol (Filter dan Tombol Create) */}
      <div className="flex flex-col md:flex-row justify-between items-center my-6">
        <div>
          <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700 mr-2">Filter:</label>
          <select
            id="statusFilter"
            className="px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">Semua</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="w-full md:w-auto px-4 py-2 mt-4 md:mt-0 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          + Tambah Task Baru
        </button>
      </div>

      {/* Konten (Daftar Task) */}
      <main>
        {renderTaskCards()}
      </main>

      {/* Modal (terkontrol oleh state) */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskSaved={handleTaskSaved}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}

export default Dashboard;