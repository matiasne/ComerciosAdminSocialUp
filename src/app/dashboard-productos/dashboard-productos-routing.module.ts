import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardProductosPage } from './dashboard-productos.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardProductosPageRoutingModule {}
