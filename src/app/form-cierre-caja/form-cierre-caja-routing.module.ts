import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormCierreCajaPage } from './form-cierre-caja.page';

const routes: Routes = [
  {
    path: '',
    component: FormCierreCajaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormCierreCajaPageRoutingModule {}
