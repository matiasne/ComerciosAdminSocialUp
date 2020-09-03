import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecortarImagenPage } from './recortar-imagen.page';

const routes: Routes = [
  {
    path: '',
    component: RecortarImagenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecortarImagenPageRoutingModule {}
