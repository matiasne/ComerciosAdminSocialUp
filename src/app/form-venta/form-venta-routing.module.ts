import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormVentaPage } from './form-venta.page';

const routes: Routes = [
  {
    path: '',
    component: FormVentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormVentaPageRoutingModule {}
