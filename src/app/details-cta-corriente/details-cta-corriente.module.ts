import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsCtaCorrientePageRoutingModule } from './details-cta-corriente-routing.module';

import { DetailsCtaCorrientePage } from './details-cta-corriente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsCtaCorrientePageRoutingModule
  ],
  declarations: [DetailsCtaCorrientePage]
})
export class DetailsCtaCorrientePageModule {}
