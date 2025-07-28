import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Sale, SaleItem } from '../models/sale.model';
import { InventoryService } from './inventory.service';
import { InventoryItem } from '../models/inventory-item.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private sales: Sale[] = [
    {
      id: '1',
      items: [
        {
          item: {
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
          quantity: 1,
          unitPrice: 999.99,
          totalPrice: 999.99
        }
      ],
      totalAmount: 999.99,
      taxAmount: 99.99,
      discountAmount: 0,
      finalAmount: 1099.98,
      customerName: 'John Doe',
      customerEmail: 'john.doe@email.com',
      paymentMethod: 'card',
      status: 'completed',
      createdAt: new Date('2023-04-01'),
      updatedAt: new Date('2023-04-01')
    }
  ];

  private salesSubject = new BehaviorSubject<Sale[]>(this.sales);
  public sales$ = this.salesSubject.asObservable();

  constructor(private inventoryService: InventoryService) {}

  getSales(): Observable<Sale[]> {
    return this.sales$;
  }

  getSale(id: string): Sale | undefined {
    return this.sales.find(sale => sale.id === id);
  }

  createSale(saleItems: { item: InventoryItem; quantity: number }[], customerInfo: { name?: string; email?: string }, paymentMethod: 'cash' | 'card' | 'credit' | 'other'): Sale {
    // Calculate totals
    const totalAmount = saleItems.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
    const taxAmount = totalAmount * 0.1; // 10% tax
    const discountAmount = 0; // No discount for now
    const finalAmount = totalAmount + taxAmount - discountAmount;

    // Create sale items
    const saleItemList: SaleItem[] = saleItems.map(item => ({
      item: item.item,
      quantity: item.quantity,
      unitPrice: item.item.price,
      totalPrice: item.item.price * item.quantity
    }));

    // Create new sale
    const newSale: Sale = {
      id: this.generateId(),
      items: saleItemList,
      totalAmount,
      taxAmount,
      discountAmount,
      finalAmount,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      paymentMethod,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to sales array
    this.sales.unshift(newSale);
    this.updateSales();

    // Update inventory
    saleItems.forEach(saleItem => {
      // Get the current inventory item to ensure we have the latest quantity
      const currentItem = this.inventoryService.getInventoryItem(saleItem.item.id);
      if (currentItem) {
        const updatedQuantity = currentItem.quantity - saleItem.quantity;
        // Ensure we don't go below zero
        if (updatedQuantity >= 0) {
          this.inventoryService.updateInventoryItem(saleItem.item.id, { quantity: updatedQuantity });
        } else {
          console.error(`Insufficient inventory for item ${saleItem.item.name}. Requested: ${saleItem.quantity}, Available: ${currentItem.quantity}`);
          throw new Error(`Insufficient inventory for item ${saleItem.item.name}`);
        }
      }
    });

    return newSale;
  }

  updateSaleStatus(id: string, status: 'completed' | 'pending' | 'cancelled'): void {
    const sale = this.sales.find(s => s.id === id);
    if (sale) {
      sale.status = status;
      sale.updatedAt = new Date();
      this.updateSales();
    }
  }

  private updateSales(): void {
    this.salesSubject.next([...this.sales]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getTotalSalesRevenue(): number {
    return this.sales
      .filter(sale => sale.status === 'completed')
      .reduce((total, sale) => total + sale.finalAmount, 0);
  }

  getSalesCount(): number {
    return this.sales.filter(sale => sale.status === 'completed').length;
  }

  getAverageOrderValue(): number {
    const completedSales = this.sales.filter(sale => sale.status === 'completed');
    if (completedSales.length === 0) return 0;
    return completedSales.reduce((total, sale) => total + sale.finalAmount, 0) / completedSales.length;
  }
}