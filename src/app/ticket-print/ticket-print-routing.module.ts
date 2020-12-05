import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketPrintPage } from './ticket-print.page';

const routes: Routes = [
  {
    path: '',
    component: TicketPrintPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketPrintPageRoutingModule {}
