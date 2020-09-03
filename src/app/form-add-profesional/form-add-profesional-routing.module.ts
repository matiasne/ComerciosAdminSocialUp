import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormAddProfesionalPage } from './form-add-profesional.page';

const routes: Routes = [
  {
    path: '',
    component: FormAddProfesionalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormAddProfesionalPageRoutingModule {}
