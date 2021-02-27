import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectGruposOpcionesPage } from './select-grupos-opciones.page';

const routes: Routes = [
  {
    path: '',
    component: SelectGruposOpcionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectGruposOpcionesPageRoutingModule {}
