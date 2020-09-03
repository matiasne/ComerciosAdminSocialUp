import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListSubscripcionesPage } from './list-subscripciones.page';

const routes: Routes = [
  {
    path: '',
    component: ListSubscripcionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListSubscripcionesPageRoutingModule {}
