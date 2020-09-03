import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormComercioPage } from './form-comercio.page';

const routes: Routes = [
  {
    path: '',
    component: FormComercioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormComercioPageRoutingModule {}
