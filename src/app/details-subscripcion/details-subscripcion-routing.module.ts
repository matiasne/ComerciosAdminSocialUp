import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsSubscripcionPage } from './details-subscripcion.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsSubscripcionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsSubscripcionPageRoutingModule {}
