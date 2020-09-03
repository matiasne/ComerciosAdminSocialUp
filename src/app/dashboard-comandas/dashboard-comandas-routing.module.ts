import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComandasPage } from './dashboard-comandas.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardComandasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardComandasPageRoutingModule {}
