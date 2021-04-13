import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormBeneficioPage } from './form-beneficio.page';

const routes: Routes = [
  {
    path: '',
    component: FormBeneficioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormBeneficioPageRoutingModule {}
