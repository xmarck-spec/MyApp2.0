import React, { useState } from 'react';
import { PlusIcon, DocumentArrowDownIcon, ArrowLeftOnRectangleIcon, MagnifyingGlassIcon, UserCircleIcon } from './icons/Icons';

interface HeaderProps {
  onLogout: () => void;
  onAddItem: () => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
  onSearch: (term: string) => void;
  onNavigateToProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onAddItem, onExportExcel, onExportPdf, onSearch, onNavigateToProfile }) => {
  const [showExportOptions, setShowExportOptions] = useState(false);

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Estoque</h1>
          </div>
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">Pesquisar</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white dark:bg-slate-700 dark:border-slate-600 text-slate-900 dark:text-slate-300 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:placeholder-slate-400 dark:focus:placeholder-slate-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  placeholder="Pesquisar por produto..."
                  type="search"
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center ml-4">
             <div className="hidden sm:flex items-center space-x-2">
                <button
                    onClick={onAddItem}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 hover:scale-105 active:scale-100"
                >
                    <PlusIcon className="h-5 w-5" />
                    <span>Novo Lançamento</span>
                </button>
                <div className="relative">
                    <button
                        onClick={() => setShowExportOptions(!showExportOptions)}
                        onBlur={() => setTimeout(() => setShowExportOptions(false), 200)}
                        className="inline-flex items-center gap-2 rounded-md bg-white dark:bg-slate-700 py-2 px-3 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                    >
                        <DocumentArrowDownIcon className="h-5 w-5" />
                        <span>Exportar</span>
                    </button>
                    <div 
                      className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-slate-700 ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 ease-out ${showExportOptions ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                    >
                        <a href="#" onClick={onExportPdf} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">Exportar para PDF</a>
                        <a href="#" onClick={onExportExcel} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">Exportar para Excel</a>
                    </div>
                </div>
            </div>
            
            <button onClick={onNavigateToProfile} className="ml-3 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-colors">
              <span className="sr-only">Perfil</span>
              <UserCircleIcon className="h-6 w-6" />
            </button>

            <button onClick={onLogout} className="ml-1 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-colors">
              <span className="sr-only">Sair</span>
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;