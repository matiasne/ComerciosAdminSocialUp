import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsPedidoWoocommercePage } from './details-pedido-woocommerce.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsPedidoWoocommercePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsPedidoWoocommercePageRoutingModule {}
