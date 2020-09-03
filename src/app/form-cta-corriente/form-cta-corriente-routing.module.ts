import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormCtaCorrientePage } from './form-cta-corriente.page';

const routes: Routes = [
  {
    path: '',
    component: FormCtaCorrientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormCtaCorrientePageRoutingModule {}
