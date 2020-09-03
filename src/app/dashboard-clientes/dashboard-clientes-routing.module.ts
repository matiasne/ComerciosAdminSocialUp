import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardClientesPage } from './dashboard-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardClientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardClientesPageRoutingModule {}
