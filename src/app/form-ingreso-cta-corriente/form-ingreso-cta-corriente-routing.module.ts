import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormIngresoCtaCorrientePage } from './form-ingreso-cta-corriente.page';

const routes: Routes = [
  {
    path: '',
    component: FormIngresoCtaCorrientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormIngresoCtaCorrientePageRoutingModule {}
