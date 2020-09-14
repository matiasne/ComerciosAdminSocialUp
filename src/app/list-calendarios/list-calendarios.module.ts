import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListCalendariosPageRoutingModule } from './list-calendarios-routing.module';

import { ListCalendariosPage } from './list-calendarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListCalendariosPageRoutingModule
  ],
  declarations: [ListCalendariosPage]
})
export class ListCalendariosPageModule {}
