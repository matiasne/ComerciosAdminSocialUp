import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListCocinasPage } from './list-cocinas.page';

const routes: Routes = [
  {
    path: '',
    component: ListCocinasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListCocinasPageRoutingModule {}
