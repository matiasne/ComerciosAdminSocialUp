import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormInvitacionPage } from './form-invitacion.page';

const routes: Routes = [
  {
    path: '',
    component: FormInvitacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormInvitacionPageRoutingModule {}
