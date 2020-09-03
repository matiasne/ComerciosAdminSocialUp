import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvitarUsuarioPage } from './invitar-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: InvitarUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvitarUsuarioPageRoutingModule {}
