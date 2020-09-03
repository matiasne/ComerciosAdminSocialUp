import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardVentasPage } from './dashboard-ventas.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardVentasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardVentasPageRoutingModule {}
