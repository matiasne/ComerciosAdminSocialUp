import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormEstiloConfiguracionPage } from './form-estilo-configuracion.page';

const routes: Routes = [
  {
    path: '',
    component: FormEstiloConfiguracionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormEstiloConfiguracionPageRoutingModule {}
