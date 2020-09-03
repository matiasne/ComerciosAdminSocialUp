import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormIngresoCajaPage } from './form-ingreso-caja.page';

const routes: Routes = [
  {
    path: '',
    component: FormIngresoCajaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormIngresoCajaPageRoutingModule {}
