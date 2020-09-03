import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormHorarioPage } from './form-horario.page';

const routes: Routes = [
  {
    path: '',
    component: FormHorarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormHorarioPageRoutingModule {}
