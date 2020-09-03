import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormPlanPage } from './form-plan.page';

const routes: Routes = [
  {
    path: '',
    component: FormPlanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormPlanPageRoutingModule {}
