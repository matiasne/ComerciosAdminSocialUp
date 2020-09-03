import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormServicioPage } from './form-servicio.page';

const routes: Routes = [
  {
    path: '',
    component: FormServicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormServicioPageRoutingModule {}
