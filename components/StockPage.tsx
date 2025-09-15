import React, { useState, useMemo } from 'react';
import { InventoryTransaction } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import StockModal from './StockModal';
import Header from './Header';
import { exportToExcel, exportToPdf } from '../services/exportService';
import { PlusIcon, PencilIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from './icons/Icons';

interface StockPageProps {
  onLogout: () => void;
  onNavigateToProfile: () => void;
}

type SortableKeys = keyof InventoryTransaction;

const StockPage: React.FC<StockPageProps> = ({ onLogout, onNavigateToProfile }) => {
  const [transactions, setTransactions] = useLocalStorage<InventoryTransaction[]>('stockTransactions', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryTransaction | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'ascending' | 'descending' }>({ key: 'date', direction: 'descending' });

  const handleOpenModal = (item: InventoryTransaction | null = null) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const handleSaveItem = (item: InventoryTransaction) => {
    if (currentItem) {
      setTransactions(prev => prev.map(i => (i.id === item.id ? item : i)));
    } else {
      setTransactions(prev => [...prev, item]);
    }
    handleCloseModal();
  };

  const handleDeleteItem = (id: string) => {
    setTransactions(prev => prev.filter(i => i.id !== id));
    handleCloseModal();
  };

  const { uniqueLocations, uniqueCategories } = useMemo(() => {
    const locations = [...new Set(transactions.map(t => t.location))].sort();
    const categories = [...new Set(transactions.map(t => t.category))].sort();
    return { uniqueLocations: locations, uniqueCategories: categories };
  }, [transactions]);
  
  const sortedAndFilteredTransactions = useMemo(() => {
    let filtered = transactions.filter(item => {
        const searchMatch = item.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const typeMatch = typeFilter === 'all' || item.type === typeFilter;
        const locationMatch = locationFilter === 'all' || item.location === locationFilter;
        const categoryMatch = categoryFilter === 'all' || item.category === categoryFilter;
        return searchMatch && typeMatch && locationMatch && categoryMatch;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined || bValue === undefined) return 0;

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [transactions, searchTerm, typeFilter, locationFilter, categoryFilter, sortConfig]);

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: SortableKeys) => {
    if (sortConfig.key !== key) {
      return null;
    }
    if (sortConfig.direction === 'ascending') {
      return <ChevronUpIcon className="h-4 w-4 ml-1" />;
    }
    return <ChevronDownIcon className="h-4 w-4 ml-1" />;
  };

  const renderSortableHeader = (key: SortableKeys, label: string) => (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
      <button onClick={() => requestSort(key)} className="flex items-center group">
        {label}
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
          {getSortIcon(key) || <ChevronDownIcon className="h-4 w-4 ml-1 text-slate-400" />}
        </span>
      </button>
    </th>
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <Header
        onLogout={onLogout}
        onAddItem={() => handleOpenModal()}
        onExportExcel={() => exportToExcel(sortedAndFilteredTransactions, 'relatorio_estoque')}
        onExportPdf={() => exportToPdf(sortedAndFilteredTransactions, 'relatorio_estoque')}
        onSearch={setSearchTerm}
        onNavigateToProfile={onNavigateToProfile}
      />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end animate-fadeInUp">
          <div>
            <label htmlFor="typeFilter" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tipo</label>
            <select id="typeFilter" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white py-2.5">
              <option value="all">Todos</option>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
          </div>
          <div>
            <label htmlFor="locationFilter" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Local</label>
            <select id="locationFilter" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white py-2.5">
              <option value="all">Todos</option>
              {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
           <div>
            <label htmlFor="categoryFilter" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Categoria</label>
            <select id="categoryFilter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white py-2.5">
              <option value="all">Todas</option>
              {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <button
            onClick={() => { setTypeFilter('all'); setLocationFilter('all'); setCategoryFilter('all'); setSearchTerm(''); }}
            className="w-full sm:w-auto justify-center rounded-md bg-slate-100 dark:bg-slate-600 py-2.5 px-4 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-500 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>

        {transactions.length === 0 ? (
           <div className="text-center py-20 animate-fadeInUp">
            <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">Nenhum lançamento no estoque</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Comece adicionando uma nova entrada ou saída.</p>
            <button
                onClick={() => handleOpenModal()}
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-indigo-600 py-2.5 px-5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 hover:scale-105 active:scale-100"
              >
              <PlusIcon className="h-5 w-5" />
              Adicionar Primeiro Lançamento
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden animate-fadeInUp" style={{ animationDelay: '200ms' }}>
             <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-100 dark:bg-slate-700">
                  <tr>
                    {renderSortableHeader('type', 'Tipo')}
                    {renderSortableHeader('productName', 'Produto')}
                    {renderSortableHeader('location', 'Local')}
                    {renderSortableHeader('category', 'Categoria')}
                    {renderSortableHeader('quantity', 'Qtd.')}
                    {renderSortableHeader('date', 'Data')}
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {sortedAndFilteredTransactions.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className="animate-fadeInUp transition-all duration-200 ease-in-out hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      style={{ animationDelay: `${index * 30}ms`, opacity: 0 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.type === 'entrada' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                          {item.type === 'entrada' ? 'Entrada' : 'Saída'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{item.productName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{item.notes || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{item.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                            <button onClick={() => handleOpenModal(item)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                                <PencilIcon className="h-5 w-5" />
                            </button>
                             <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
             {sortedAndFilteredTransactions.length === 0 && (transactions.length > 0) && (
                <div className="text-center py-10 animate-fadeIn">
                    <p className="text-slate-500 dark:text-slate-400">Nenhum lançamento encontrado com os filtros atuais.</p>
                </div>
            )}
          </div>
        )}
      </main>
      {isModalOpen && (
        <StockModal
          item={currentItem}
          onClose={handleCloseModal}
          onSave={handleSaveItem}
          onDelete={handleDeleteItem}
        />
      )}
    </div>
  );
};

export default StockPage;