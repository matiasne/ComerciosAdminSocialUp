import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListHorariosPage } from './list-horarios.page';

const routes: Routes = [
  {
    path: '',
    component: ListHorariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListHorariosPageRoutingModule {}
