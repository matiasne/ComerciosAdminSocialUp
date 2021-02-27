import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListGruposOpcionesPage } from './list-grupos-opciones.page';

const routes: Routes = [
  {
    path: '',
    component: ListGruposOpcionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListGruposOpcionesPageRoutingModule {}
