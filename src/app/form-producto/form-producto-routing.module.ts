import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormProductoPage } from './form-producto.page';

const routes: Routes = [
  {
    path: '',
    component: FormProductoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormProductoPageRoutingModule {}
