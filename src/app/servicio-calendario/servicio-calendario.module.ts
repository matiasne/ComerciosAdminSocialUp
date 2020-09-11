import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicioCalendarioPageRoutingModule } from './servicio-calendario-routing.module';

import { ServicioCalendarioPage } from './servicio-calendario.page';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FullCalendarModule,
    IonicModule,
    ServicioCalendarioPageRoutingModule
  ],
  declarations: [ServicioCalendarioPage]
})
export class ServicioCalendarioPageModule {}
