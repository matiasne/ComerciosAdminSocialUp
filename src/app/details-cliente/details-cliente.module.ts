import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsClientePageRoutingModule } from './details-cliente-routing.module';

import { DetailsClientePage } from './details-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsClientePageRoutingModule
  ],
  declarations: [DetailsClientePage]
})
export class DetailsClientePageModule {}
