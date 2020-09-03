import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListNotificacionesPage } from './list-notificaciones.page';

const routes: Routes = [
  {
    path: '',
    component: ListNotificacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListNotificacionesPageRoutingModule {}
