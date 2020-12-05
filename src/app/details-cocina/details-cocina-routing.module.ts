import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsCocinaPage } from './details-cocina.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsCocinaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsCocinaPageRoutingModule {}
