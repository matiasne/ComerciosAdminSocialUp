import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsServicioPage } from './details-servicio.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsServicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsServicioPageRoutingModule {}
