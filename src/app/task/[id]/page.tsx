"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ITask } from '@/models/Task';
import dynamic from 'next/dynamic';

export default function CreateEditTaskPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ITask['status']>('pendente');
  const [priority, setPriority] = useState<ITask['priority']>('média');
  const [dueDate, setDueDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  useEffect(() => {
    if (taskId) {
      setIsEditing(true);
      fetchTask();
    }
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`);
      const data = await response.json();

      if (response.ok) {
        const task = data.task;
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setPriority(task.priority);
        setDueDate(new Date(task.dueDate).toISOString().split('T')[0]);
      } else {
        console.error(data.message || 'Erro ao buscar tarefa');
        router.push('/');
      }
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      router.push('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        title,
        description,
        status,
        priority,
        dueDate: new Date(dueDate),
      };

      const endpoint = isEditing 
        ? `/api/tasks/${taskId}` 
        : '/api/tasks';
      
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(isEditing ? 'Tarefa atualizada com sucesso!' : 'Tarefa criada com sucesso!');
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        console.error(data.message || 'Erro ao salvar tarefa');
      }
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isEditing ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2">Título</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
              placeholder="Digite o título da tarefa"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block mb-2">Descrição</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="Descrição detalhada da tarefa"
              rows={4}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="status" className="block mb-2">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ITask['status'])}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="pendente">Pendente</option>
              <option value="em progresso">Em Progresso</option>
              <option value="concluída">Concluída</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="priority" className="block mb-2">Prioridade</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as ITask['priority'])}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="baixa">Baixa</option>
              <option value="média">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="dueDate" className="block mb-2">Data de Conclusão</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          
          <div className="flex justify-between">
            <button 
              type="button"
              onClick={() => router.push('/')}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {isEditing ? 'Atualizar' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
