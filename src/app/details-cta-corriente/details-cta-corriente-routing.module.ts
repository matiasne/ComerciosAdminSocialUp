import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsCtaCorrientePage } from './details-cta-corriente.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsCtaCorrientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsCtaCorrientePageRoutingModule {}
