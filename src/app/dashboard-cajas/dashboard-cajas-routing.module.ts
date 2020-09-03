import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardCajasPage } from './dashboard-cajas.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardCajasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardCajasPageRoutingModule {}
