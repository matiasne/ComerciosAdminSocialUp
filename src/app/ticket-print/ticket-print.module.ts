import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketPrintPageRoutingModule } from './ticket-print-routing.module';

import { TicketPrintPage } from './ticket-print.page';
import { ComponentsModule } from '../Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    TicketPrintPageRoutingModule
  ],
  declarations: [TicketPrintPage]
})
export class TicketPrintPageModule {}
