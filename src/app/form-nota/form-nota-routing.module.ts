import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormNotaPage } from './form-nota.page';

const routes: Routes = [
  {
    path: '',
    component: FormNotaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormNotaPageRoutingModule {}
