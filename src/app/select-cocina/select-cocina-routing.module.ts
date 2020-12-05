import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectCocinaPage } from './select-cocina.page';

const routes: Routes = [
  {
    path: '',
    component: SelectCocinaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectCocinaPageRoutingModule {}
