import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddServicioSubscripcionPage } from './add-servicio-subscripcion.page';

const routes: Routes = [
  {
    path: '',
    component: AddServicioSubscripcionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddServicioSubscripcionPageRoutingModule {}
