import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListMesasPage } from './list-mesas.page';

const routes: Routes = [
  {
    path: '',
    component: ListMesasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListMesasPageRoutingModule {}
