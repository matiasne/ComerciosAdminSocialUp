import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsCajaPage } from './details-caja.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsCajaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsCajaPageRoutingModule {}
