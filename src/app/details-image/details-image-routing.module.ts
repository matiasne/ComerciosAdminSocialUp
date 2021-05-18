import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsImagePage } from './details-image.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsImagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsImagePageRoutingModule {}
