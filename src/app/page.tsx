"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { ITask } from '@/models/Task';
import dynamic from 'next/dynamic';

export default function HomePage() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();

      if (response.ok) {
        setTasks(data);
      } else {
        // toast.error(data.message || 'Erro ao buscar tarefas');
      }
      setLoading(false);
    } catch (error) {
      console.error('Erro:', error);
      // toast.error('Erro de conexão');
      setLoading(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      const data = await response.json();

      if (response.ok) {
        setTasks(tasks.filter(task => task._id !== taskId));
        // toast.success('Tarefa excluída com sucesso');
      } else {
        // toast.error(data.message || 'Erro ao excluir tarefa');
      }
    } catch (error) {
      console.error('Erro:', error);
      // toast.error('Erro de conexão');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });

      if (response.ok) {
        router.push('/');
      } else {
        // toast.error('Erro ao fazer logout');
      }
    } catch (error) {
      console.error('Erro:', error);
      // toast.error('Erro de conexão');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Minhas Tarefas</h1>
        <div>
          <button
            onClick={() => router.push('/task')}
            className="bg-green-500 text-white px-4 py-2 rounded mr-4"
          >
            Nova Tarefa
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sair
          </button>
        </div>
      </div>

      {loading ? (
        <p>Carregando tarefas...</p>
      ) : tasks?.length === 0 ? (
        <p>Nenhuma tarefa encontrada.</p>
      ) : (
        <div className="grid gap-4">
          {tasks?.map((task) => (
            <div
              key={task._id}
              className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{task.title}</h2>
                <p className="text-gray-600">{task.description}</p>
                <div className="mt-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${task.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                        task.status === 'em progresso' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                      }`}
                  >
                    {task.status}
                  </span>
                  <span className="ml-2 text-gray-500">
                    Prazo: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div>
                <button
                  onClick={() => router.push(`/task/${task._id}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(task._id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* <ToastContainer /> */}
    </div>
  );
}