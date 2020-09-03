import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComercioPage } from './dashboard-comercio.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardComercioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardComercioPageRoutingModule {}
