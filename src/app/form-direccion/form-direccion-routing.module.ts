import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormDireccionPage } from './form-direccion.page';

const routes: Routes = [
  {
    path: '',
    component: FormDireccionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormDireccionPageRoutingModule {}
