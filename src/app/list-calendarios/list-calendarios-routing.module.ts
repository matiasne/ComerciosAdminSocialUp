import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListCalendariosPage } from './list-calendarios.page';

const routes: Routes = [
  {
    path: '',
    component: ListCalendariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListCalendariosPageRoutingModule {}
