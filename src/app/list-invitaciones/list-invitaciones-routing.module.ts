import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListInvitacionesPage } from './list-invitaciones.page';

const routes: Routes = [
  {
    path: '',
    component: ListInvitacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListInvitacionesPageRoutingModule {}
