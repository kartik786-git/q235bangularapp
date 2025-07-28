export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  quantity: number;
  minStockLevel: number;
  supplier: string;
  sku: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}