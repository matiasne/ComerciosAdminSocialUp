import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsWhatsappPage } from './details-whatsapp.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsWhatsappPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsWhatsappPageRoutingModule {}
