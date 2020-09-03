import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsVentaPage } from './details-venta.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsVentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsVentaPageRoutingModule {}
