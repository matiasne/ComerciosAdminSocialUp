import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardSubscripcionesPage } from './dashboard-subscripciones.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardSubscripcionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardSubscripcionesPageRoutingModule {}
