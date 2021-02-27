import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsComandaPage } from './details-comanda.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsComandaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsComandaPageRoutingModule {}
