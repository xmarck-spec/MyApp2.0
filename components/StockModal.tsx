import React, { useState, useEffect } from 'react';
import { InventoryTransaction } from '../types';

interface StockModalProps {
  item: InventoryTransaction | null;
  onClose: () => void;
  onSave: (item: InventoryTransaction) => void;
  onDelete?: (id: string) => void;
}

const StockModal: React.FC<StockModalProps> = ({ item, onClose, onSave, onDelete }) => {
  const [type, setType] = useState<'entrada' | 'saida'>('entrada');
  const [productName, setProductName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (item) {
      setType(item.type);
      setProductName(item.productName);
      setLocation(item.location);
      setCategory(item.category);
      setQuantity(item.quantity);
      setDate(item.date);
      setNotes(item.notes || '');
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: item?.id || new Date().toISOString() + Math.random(),
      type,
      productName,
      location,
      category,
      quantity,
      date,
      notes,
    });
  };

  const handleDelete = () => {
    if (item && onDelete) {
       if (window.confirm('Tem certeza que deseja excluir este lançamento? A ação não pode ser desfeita.')) {
            onDelete(item.id);
       }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10 p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl animate-zoomIn" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{item ? 'Editar Lançamento' : 'Adicionar Novo Lançamento'}</h3>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome do Produto</label>
                <input
                  type="text"
                  id="productName"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tipo de Movimentação</label>
                <select
                  id="type"
                  value={type}
                  onChange={e => setType(e.target.value as 'entrada' | 'saida')}
                  required
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                >
                  <option value="entrada">Entrada</option>
                  <option value="saida">Saída</option>
                </select>
              </div>
               <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Local</label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
               <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Categoria</label>
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Quantidade</label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value, 10)) || 1)}
                  required
                  min="1"
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data</label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Observações (Opcional)</label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                ></textarea>
              </div>
            </div>
          </div>
          <div className={`bg-slate-50 dark:bg-slate-700/50 px-6 py-3 flex ${item && onDelete ? 'justify-between' : 'justify-end'} items-center rounded-b-lg`}>
            {item && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="py-2 px-4 border border-red-300 dark:border-red-600 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-300 bg-white dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-800 transition-colors"
              >
                Excluir
              </button>
            )}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockModal;
