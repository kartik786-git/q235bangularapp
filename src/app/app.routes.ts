import { Routes } from '@angular/router';
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { InventoryFormComponent } from './components/inventory-form/inventory-form.component';
import { SalesDashboardComponent } from './components/sales-dashboard/sales-dashboard.component';
import { SaleFormComponent } from './components/sale-form/sale-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/inventory', pathMatch: 'full' },
  { path: 'inventory', component: InventoryListComponent },
  { path: 'inventory/add', component: InventoryFormComponent },
  { path: 'inventory/edit/:id', component: InventoryFormComponent },
  { path: 'sales', component: SalesDashboardComponent },
  { path: 'sales/new', component: SaleFormComponent },
  { path: '**', redirectTo: '/inventory' }
];
