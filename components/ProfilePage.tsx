import React, { useState } from 'react';
import { UserCredentials } from '../types';
import { ArrowLeftIcon } from './icons/Icons';

interface ProfilePageProps {
  currentUser: UserCredentials;
  onUpdateUser: (newCredentials: UserCredentials) => void;
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onUpdateUser, onBack }) => {
  const [newUsername, setNewUsername] = useState(currentUser.username);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate current password
    if (currentPassword !== currentUser.password) {
      setError('A senha atual está incorreta.');
      return;
    }
    
    // If new password is being set, validate it
    if (newPassword) {
        if (newPassword.length < 6) {
            setError('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('As novas senhas não coincidem.');
            return;
        }
    }

    const updatedCredentials = {
      username: newUsername,
      password: newPassword || currentUser.password, // Keep old password if new one is not provided
    };

    onUpdateUser(updatedCredentials);
    setSuccess('Perfil atualizado com sucesso! Você será deslogado por segurança.');
    // The App component will handle logout after update
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 px-4 animate-fadeIn">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-2xl shadow-lg dark:bg-slate-800 relative">
        <button onClick={onBack} className="absolute top-4 left-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <ArrowLeftIcon className="h-6 w-6" />
          <span className="sr-only">Voltar</span>
        </button>
        <div>
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white">
            Gerenciar Perfil
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Atualize seu nome de usuário e senha.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome de Usuário</label>
            <input
              id="username"
              type="text"
              required
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>
          <hr className="dark:border-slate-600" />
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Senha Atual</label>
            <input
              id="currentPassword"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              placeholder="Digite sua senha atual para salvar"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nova Senha (Opcional)</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              placeholder="Deixe em branco para não alterar"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirmar Nova Senha</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              disabled={!newPassword}
            />
          </div>

          {error && <p className="text-sm text-center text-red-500 animate-shake">{error}</p>}
          {success && <p className="text-sm text-center text-green-500">{success}</p>}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="group relative flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-all"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;