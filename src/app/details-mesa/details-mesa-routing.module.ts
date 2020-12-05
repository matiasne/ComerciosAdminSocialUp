import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsMesaPage } from './details-mesa.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsMesaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsMesaPageRoutingModule {}
