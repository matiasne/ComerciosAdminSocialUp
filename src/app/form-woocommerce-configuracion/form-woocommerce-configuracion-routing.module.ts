import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormWoocommerceConfiguracionPage } from './form-woocommerce-configuracion.page';

const routes: Routes = [
  {
    path: '',
    component: FormWoocommerceConfiguracionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormWoocommerceConfiguracionPageRoutingModule {}
