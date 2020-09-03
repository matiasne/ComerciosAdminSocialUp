import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListClientesPage } from './list-clientes.page';

const routes: Routes = [
  {
    path: '',
    component: ListClientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListClientesPageRoutingModule {}
