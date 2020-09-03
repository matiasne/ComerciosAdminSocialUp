import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsClientePage } from './details-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsClientePageRoutingModule {}
