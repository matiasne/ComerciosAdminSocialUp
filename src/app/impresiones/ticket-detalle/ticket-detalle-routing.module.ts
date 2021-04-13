import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketDetallePage } from './ticket-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: TicketDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketDetallePageRoutingModule {}
