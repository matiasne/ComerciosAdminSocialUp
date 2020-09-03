import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListCajasPage } from './list-cajas.page';

const routes: Routes = [
  {
    path: '',
    component: ListCajasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListCajasPageRoutingModule {}
