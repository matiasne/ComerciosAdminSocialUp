import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListPedidosPage } from './list-pedidos.page';

const routes: Routes = [
  {
    path: '',
    component: ListPedidosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListPedidosPageRoutingModule {}
