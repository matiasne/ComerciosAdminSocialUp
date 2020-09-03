import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListCtaCorrientesPage } from './list-cta-corrientes.page';

const routes: Routes = [
  {
    path: '',
    component: ListCtaCorrientesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListCtaCorrientesPageRoutingModule {}
