import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormComercioConfiguracionPage } from './form-comercio-configuracion.page';

const routes: Routes = [
  {
    path: '',
    component: FormComercioConfiguracionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormComercioConfiguracionPageRoutingModule {}
