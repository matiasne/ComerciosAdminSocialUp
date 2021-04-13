import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectBeneficioPage } from './select-beneficio.page';

const routes: Routes = [
  {
    path: '',
    component: SelectBeneficioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectBeneficioPageRoutingModule {}
