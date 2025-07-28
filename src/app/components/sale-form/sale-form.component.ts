import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { SalesService } from '../../services/sales.service';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/inventory-item.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.css']
})
export class SaleFormComponent implements OnInit {
  saleForm: FormGroup;
  availableItems: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  searchQuery: string = '';

  constructor(
    private fb: FormBuilder,
    private salesService: SalesService,
    private inventoryService: InventoryService
  ) {
    this.saleForm = this.fb.group({
      customerName: [''],
      customerEmail: ['', [Validators.email]],
      paymentMethod: ['cash', Validators.required],
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadInventory();
    this.addItem();
  }

  loadInventory(): void {
    this.inventoryService.getInventory().subscribe(items => {
      this.availableItems = items.filter(item => item.quantity > 0);
      this.filteredItems = [...this.availableItems];
    });
  }

  get items(): FormArray {
    return this.saleForm.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      item: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      searchQuery: ['']
    });
    
    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  filterItems(index: number): void {
    const itemControl = this.items.at(index);
    const query = itemControl.get('searchQuery')?.value?.toLowerCase() || '';
    if (query) {
      this.filteredItems = this.availableItems.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query)
      );
    } else {
      this.filteredItems = [...this.availableItems];
    }
  }

  onItemSelect(index: number, item: InventoryItem): void {
    const itemControl = this.items.at(index);
    itemControl.get('item')?.setValue(item);
    itemControl.get('searchQuery')?.setValue('');
    this.filteredItems = [...this.availableItems];
  }

  calculateItemTotal(item: any): number {
    const inventoryItem = item.value?.item;
    const quantity = item.value?.quantity || 0;
    return inventoryItem ? inventoryItem.price * quantity : 0;
  }

  calculateSubtotal(): number {
    return this.items.controls.reduce((sum, item) => {
      return sum + this.calculateItemTotal(item);
    }, 0);
  }

  calculateTax(): number {
    return this.calculateSubtotal() * 0.1; // 10% tax
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTax();
  }

  onSubmit(): void {
    if (this.saleForm.valid) {
      const formValue = this.saleForm.value;
      
      // Extract sale items with proper typing
      const saleItems = formValue.items
        .map((item: any) => ({
          item: item.item,
          quantity: item.quantity
        }))
        .filter((item: any) => item.item); // Filter out empty items
      
      const customerInfo = {
        name: formValue.customerName,
        email: formValue.customerEmail
      };
      
      // Create the sale
      this.salesService.createSale(saleItems, customerInfo, formValue.paymentMethod);
      
      // Reset form
      this.saleForm.reset();
      this.items.clear();
      this.addItem();
      
      // Show success message or navigate
      alert('Sale completed successfully!');
    }
  }
}