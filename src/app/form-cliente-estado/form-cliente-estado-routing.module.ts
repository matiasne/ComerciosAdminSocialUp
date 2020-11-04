import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormClienteEstadoPage } from './form-cliente-estado.page';

const routes: Routes = [
  {
    path: '',
    component: FormClienteEstadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormClienteEstadoPageRoutingModule {}
