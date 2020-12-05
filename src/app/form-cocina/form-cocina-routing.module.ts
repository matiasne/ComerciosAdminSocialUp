import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormCocinaPage } from './form-cocina.page';

const routes: Routes = [
  {
    path: '',
    component: FormCocinaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormCocinaPageRoutingModule {}
