import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormComandaConfiguracionPage } from './form-comanda-configuracion.page';

const routes: Routes = [
  {
    path: '',
    component: FormComandaConfiguracionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormComandaConfiguracionPageRoutingModule {}
