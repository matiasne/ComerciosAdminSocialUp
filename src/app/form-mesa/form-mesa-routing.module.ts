import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormMesaPage } from './form-mesa.page';

const routes: Routes = [
  {
    path: '',
    component: FormMesaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormMesaPageRoutingModule {}
