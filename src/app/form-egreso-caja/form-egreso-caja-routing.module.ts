import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormEgresoCajaPage } from './form-egreso-caja.page';

const routes: Routes = [
  {
    path: '',
    component: FormEgresoCajaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormEgresoCajaPageRoutingModule {}
