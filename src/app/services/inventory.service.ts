import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InventoryItem } from '../models/inventory-item.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private inventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Laptop',
      description: 'High-performance laptop for professionals',
      category: 'Electronics',
      price: 999.99,
      cost: 750.00,
      quantity: 25,
      minStockLevel: 5,
      supplier: 'Tech Distributors Inc.',
      sku: 'LT-2023-001',
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-01-15')
    },
    {
      id: '2',
      name: 'Desk Chair',
      description: 'Ergonomic office chair with lumbar support',
      category: 'Furniture',
      price: 299.99,
      cost: 180.00,
      quantity: 15,
      minStockLevel: 3,
      supplier: 'Office Solutions Ltd.',
      sku: 'DC-2023-002',
      imageUrl: 'https://images.unsplash.com/photo-1525535535326-cb74ffdd9191?w=800&q=80',
      createdAt: new Date('2023-02-20'),
      updatedAt: new Date('2023-02-20')
    },
    {
      id: '3',
      name: 'Monitor',
      description: '27-inch 4K Ultra HD monitor',
      category: 'Electronics',
      price: 499.99,
      cost: 350.00,
      quantity: 12,
      minStockLevel: 4,
      supplier: 'Display Masters Corp.',
      sku: 'MN-2023-003',
      imageUrl: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&q=80',
      createdAt: new Date('2023-03-10'),
      updatedAt: new Date('2023-03-10')
    }
  ];

  private inventorySubject = new BehaviorSubject<InventoryItem[]>(this.inventoryItems);
  public inventory$ = this.inventorySubject.asObservable();

  getInventory(): Observable<InventoryItem[]> {
    return this.inventory$;
  }

  getInventoryItem(id: string): InventoryItem | undefined {
    return this.inventoryItems.find(item => item.id === id);
  }

  addInventoryItem(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newItem: InventoryItem = {
      ...item,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.inventoryItems.push(newItem);
    this.updateInventory();
  }

  updateInventoryItem(id: string, item: Partial<Omit<InventoryItem, 'id' | 'createdAt'>>): void {
    const index = this.inventoryItems.findIndex(i => i.id === id);
    if (index !== -1) {
      this.inventoryItems[index] = {
        ...this.inventoryItems[index],
        ...item,
        updatedAt: new Date()
      };
      this.updateInventory();
    }
  }

  deleteInventoryItem(id: string): void {
    this.inventoryItems = this.inventoryItems.filter(item => item.id !== id);
    this.updateInventory();
  }

  private updateInventory(): void {
    this.inventorySubject.next([...this.inventoryItems]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getLowStockItems(): InventoryItem[] {
    return this.inventoryItems.filter(item => item.quantity <= item.minStockLevel);
  }

  getTotalInventoryValue(): number {
    return this.inventoryItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}