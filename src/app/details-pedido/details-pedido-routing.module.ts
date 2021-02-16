import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsPedidoPage } from './details-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsPedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsPedidoPageRoutingModule {}
