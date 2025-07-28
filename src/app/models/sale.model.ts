import { InventoryItem } from './inventory-item.model';

export interface SaleItem {
  item: InventoryItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  finalAmount: number;
  customerName?: string;
  customerEmail?: string;
  paymentMethod: 'cash' | 'card' | 'credit' | 'other';
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}