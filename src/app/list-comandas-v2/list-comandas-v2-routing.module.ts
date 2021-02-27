import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComandasV2Page } from './list-comandas-v2.page';

const routes: Routes = [
  {
    path: '',
    component: ListComandasV2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListComandasV2PageRoutingModule {}
