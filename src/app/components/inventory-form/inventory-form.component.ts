import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/inventory-item.model';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.css']
})
export class InventoryFormComponent implements OnInit {
  inventoryForm: FormGroup;
  isEdit: boolean = false;
  itemId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.inventoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      cost: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      minStockLevel: ['', [Validators.required, Validators.min(0)]],
      supplier: ['', Validators.required],
      sku: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9-]+$')]],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.isEdit = true;
      const item = this.inventoryService.getInventoryItem(this.itemId);
      if (item) {
        this.inventoryForm.patchValue(item);
      }
    }
  }

  onSubmit(): void {
    if (this.inventoryForm.valid) {
      const formValue = this.inventoryForm.value;
      
      if (this.isEdit && this.itemId) {
        this.inventoryService.updateInventoryItem(this.itemId, formValue);
      } else {
        this.inventoryService.addInventoryItem(formValue);
      }
      
      this.router.navigate(['/inventory']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/inventory']);
  }
}