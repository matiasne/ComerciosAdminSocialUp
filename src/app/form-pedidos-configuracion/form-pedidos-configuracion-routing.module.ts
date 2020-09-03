import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormPedidosConfiguracionPage } from './form-pedidos-configuracion.page';

const routes: Routes = [
  {
    path: '',
    component: FormPedidosConfiguracionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormPedidosConfiguracionPageRoutingModule {}
