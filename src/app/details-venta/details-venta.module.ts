import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsVentaPageRoutingModule } from './details-venta-routing.module';

import { DetailsVentaPage } from './details-venta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsVentaPageRoutingModule
  ],
  declarations: [DetailsVentaPage]
})
export class DetailsVentaPageModule {}
