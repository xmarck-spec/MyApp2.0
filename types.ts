export interface InventoryTransaction {
  id: string;
  type: 'entrada' | 'saida';
  productName: string;
  location: string;
  category: string;
  quantity: number;
  date: string; // YYYY-MM-DD
  notes?: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}
