import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComandasPage } from './list-comandas.page';

const routes: Routes = [
  {
    path: '',
    component: ListComandasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListComandasPageRoutingModule {}
