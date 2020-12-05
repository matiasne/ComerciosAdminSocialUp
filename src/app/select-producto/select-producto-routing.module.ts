import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectProductoPage } from './select-producto.page';

const routes: Routes = [
  {
    path: '',
    component: SelectProductoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectProductoPageRoutingModule {}
