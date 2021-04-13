import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListBeneficiosPage } from './list-beneficios.page';

const routes: Routes = [
  {
    path: '',
    component: ListBeneficiosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListBeneficiosPageRoutingModule {}
