import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormReservaPage } from './form-reserva.page';

const routes: Routes = [
  {
    path: '',
    component: FormReservaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormReservaPageRoutingModule {}
