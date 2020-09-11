import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormCalendarioPage } from './form-calendario.page';

const routes: Routes = [
  {
    path: '',
    component: FormCalendarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormCalendarioPageRoutingModule {}
