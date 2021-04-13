import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambiarPlanPage } from './cambiar-plan.page';

const routes: Routes = [
  {
    path: '',
    component: CambiarPlanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambiarPlanPageRoutingModule {}
