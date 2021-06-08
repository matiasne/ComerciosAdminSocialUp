import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalNotificacionPage } from './modal-notificacion.page';

const routes: Routes = [
  {
    path: '',
    component: ModalNotificacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalNotificacionPageRoutingModule {}
