import Dexie, { type Table } from 'dexie';

export interface Payment {
  id?: number;
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  synced: 0 | 1;
}

export class AppDatabase extends Dexie {
  payments!: Table<Payment>;

  constructor() {
    super('ResilientPaymentDB');
    this.version(1).stores({
      payments: '++id, amount, description, status, createdAt, synced'
    });
  }
}

export const db = new AppDatabase();
