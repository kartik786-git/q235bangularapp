import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../services/sales.service';
import { InventoryService } from '../../services/inventory.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.css']
})
export class SalesDashboardComponent implements OnInit {
  totalRevenue: number = 0;
  salesCount: number = 0;
  averageOrderValue: number = 0;
  lowStockItems: any[] = [];

  constructor(
    private salesService: SalesService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    this.loadSalesData();
    this.loadLowStockItems();
  }

  loadSalesData(): void {
    this.totalRevenue = this.salesService.getTotalSalesRevenue();
    this.salesCount = this.salesService.getSalesCount();
    this.averageOrderValue = this.salesService.getAverageOrderValue();
  }

  loadLowStockItems(): void {
    this.lowStockItems = this.inventoryService.getLowStockItems();
  }
}