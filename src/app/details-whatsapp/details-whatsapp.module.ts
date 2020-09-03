import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsWhatsappPageRoutingModule } from './details-whatsapp-routing.module';

import { DetailsWhatsappPage } from './details-whatsapp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsWhatsappPageRoutingModule
  ],
  declarations: [DetailsWhatsappPage]
})
export class DetailsWhatsappPageModule {}
