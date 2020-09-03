import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListProductosServiciosPage } from './list-productos-servicios.page';

const routes: Routes = [
  {
    path: '',
    component: ListProductosServiciosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListProductosServiciosPageRoutingModule {}
