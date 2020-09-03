import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComerciosOwnerPage } from './list-comercios-owner.page';

const routes: Routes = [
  {
    path: '',
    component: ListComerciosOwnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListComerciosOwnerPageRoutingModule {}
