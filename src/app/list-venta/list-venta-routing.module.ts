import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListVentaPage } from './list-venta.page';

const routes: Routes = [
  {
    path: '',
    component: ListVentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListVentaPageRoutingModule {}
