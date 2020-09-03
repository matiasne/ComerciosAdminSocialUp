import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsCarritoPage } from './details-carrito.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsCarritoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsCarritoPageRoutingModule {}
