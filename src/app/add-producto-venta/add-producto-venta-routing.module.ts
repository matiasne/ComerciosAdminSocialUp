import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddProductoVentaPage } from './add-producto-venta.page';

const routes: Routes = [
  {
    path: '',
    component: AddProductoVentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddProductoVentaPageRoutingModule {}
