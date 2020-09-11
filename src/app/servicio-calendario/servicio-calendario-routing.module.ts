import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicioCalendarioPage } from './servicio-calendario.page';

const routes: Routes = [
  {
    path: '',
    component: ServicioCalendarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicioCalendarioPageRoutingModule {}
