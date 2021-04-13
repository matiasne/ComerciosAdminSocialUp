import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormRecargoPage } from './form-recargo.page';

const routes: Routes = [
  {
    path: '',
    component: FormRecargoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormRecargoPageRoutingModule {}
