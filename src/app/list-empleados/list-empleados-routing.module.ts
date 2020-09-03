import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListEmpleadosPage } from './list-empleados.page';

const routes: Routes = [
  {
    path: '',
    component: ListEmpleadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListEmpleadosPageRoutingModule {}
