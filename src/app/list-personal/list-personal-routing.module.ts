import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListPersonalPage } from './list-personal.page';

const routes: Routes = [
  {
    path: '',
    component: ListPersonalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListPersonalPageRoutingModule {}
