import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormFilterPedidosPage } from './form-filter-pedidos.page';

const routes: Routes = [
  {
    path: '',
    component: FormFilterPedidosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormFilterPedidosPageRoutingModule {}
