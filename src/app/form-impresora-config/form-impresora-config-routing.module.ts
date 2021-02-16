import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormImpresoraConfigPage } from './form-impresora-config.page';

const routes: Routes = [
  {
    path: '',
    component: FormImpresoraConfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormImpresoraConfigPageRoutingModule {}
