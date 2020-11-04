import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormStockPage } from './form-stock.page';

const routes: Routes = [
  {
    path: '',
    component: FormStockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormStockPageRoutingModule {}
