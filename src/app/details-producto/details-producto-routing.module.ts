import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsProductoPage } from './details-producto.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsProductoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsProductoPageRoutingModule {}
