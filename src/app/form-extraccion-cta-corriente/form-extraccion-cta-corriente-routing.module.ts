import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormExtraccionCtaCorrientePage } from './form-extraccion-cta-corriente.page';

const routes: Routes = [
  {
    path: '',
    component: FormExtraccionCtaCorrientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormExtraccionCtaCorrientePageRoutingModule {}
