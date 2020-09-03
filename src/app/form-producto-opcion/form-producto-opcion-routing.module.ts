import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormProductoOpcionPage } from './form-producto-opcion.page';

const routes: Routes = [
  {
    path: '',
    component: FormProductoOpcionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormProductoOpcionPageRoutingModule {}
