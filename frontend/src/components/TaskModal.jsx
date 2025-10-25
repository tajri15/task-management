import React, { useState, useEffect } from 'react';
import api from '../services/api';

function TaskModal({ isOpen, onClose, onTaskSaved, taskToEdit }) {
  // State untuk form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  // Cek mode: apakah ini mode 'edit' atau 'create'
  const isEditMode = Boolean(taskToEdit);

  // useEffect untuk mengisi form jika ini mode edit
  useEffect(() => {
    if (isEditMode) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status);
      setDeadline(taskToEdit.deadline ? taskToEdit.deadline.slice(0, 16) : '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('To Do');
      setDeadline('');
    }
  }, [isOpen, taskToEdit, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const taskData = { title, description, status, deadline };

    try {
      if (isEditMode) {
        await api.put(`/tasks/${taskToEdit.task_id}`, taskData);
      } else {
        await api.post('/tasks', taskData);
      }
      
      onTaskSaved();
      onClose();
    } catch (err) {
      console.error('Gagal menyimpan task:', err.response?.data);
      setError('Gagal menyimpan task. Pastikan semua data terisi benar.');
    }
  };

  if (!isOpen) return null;

  return (
    // Backdrop (overlay)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Konten Modal */}
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4">
          {isEditMode ? 'Edit Task' : 'Buat Task Baru'}
        </h2>
        
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Judul */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul</label>
            <input
              id="title" type="text" required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Deskripsi */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi (Opsional)</label>
            <textarea
              id="description" rows="3"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Status */}
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status" required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md bg-white"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          {/* Deadline */}
          <div className="mb-4">
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline (Opsional)</label>
            <input
              id="deadline" type="datetime-local"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;