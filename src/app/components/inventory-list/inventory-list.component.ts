import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/inventory-item.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit {
  inventoryItems: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  searchTerm: string = '';
  totalItems: number = 0;
  totalValue: number = 0;
  lowStockItems: InventoryItem[] = [];

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.inventoryService.getInventory().subscribe(items => {
      this.inventoryItems = items;
      this.filteredItems = [...items];
      this.calculateStats();
    });
  }

  calculateStats(): void {
    this.totalItems = this.inventoryItems.length;
    this.totalValue = this.inventoryService.getTotalInventoryValue();
    this.lowStockItems = this.inventoryService.getLowStockItems();
  }

  filterItems(): void {
    if (!this.searchTerm) {
      this.filteredItems = [...this.inventoryItems];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredItems = this.inventoryItems.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.sku.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
    }
  }

  deleteItem(id: string): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.inventoryService.deleteInventoryItem(id);
    }
  }
}