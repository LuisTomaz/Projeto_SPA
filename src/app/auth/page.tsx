"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      
      const payload = isLogin 
        ? { email, password }
        : { name, email, password };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Sucesso no login ou registro
        toast.success(isLogin ? 'Login bem-sucedido!' : 'Registro bem-sucedido!');
        
        // Redireciona para a página inicial após um curto atraso
        setTimeout(() => {
          router.push('/home');
        }, 1500);
      } else {
        // Erro no login ou registro
        toast.error(data.message || 'Ocorreu um erro');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro de conexão');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Cadastro'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2">Nome</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>
        
        <p className="text-center mt-4">
          {isLogin ? 'Não tem conta?' : 'Já tem conta?'}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-blue-500 hover:underline"
          >
            {isLogin ? 'Cadastre-se' : 'Faça login'}
          </button>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}