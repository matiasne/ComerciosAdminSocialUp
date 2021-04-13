import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketDetallePageRoutingModule } from './ticket-detalle-routing.module';

import { TicketDetallePage } from './ticket-detalle.page';
import { ComponentsModule } from 'src/app/Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    TicketDetallePageRoutingModule
  ],
  declarations: [TicketDetallePage]
})
export class TicketDetallePageModule {}
