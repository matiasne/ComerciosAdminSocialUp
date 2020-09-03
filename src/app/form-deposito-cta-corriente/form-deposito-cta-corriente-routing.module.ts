import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormDepositoCtaCorrientePage } from './form-deposito-cta-corriente.page';

const routes: Routes = [
  {
    path: '',
    component: FormDepositoCtaCorrientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormDepositoCtaCorrientePageRoutingModule {}
