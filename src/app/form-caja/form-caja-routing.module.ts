import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormCajaPage } from './form-caja.page';

const routes: Routes = [
  {
    path: '',
    component: FormCajaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormCajaPageRoutingModule {}
