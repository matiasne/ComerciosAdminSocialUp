import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsCarritoPageRoutingModule } from './details-carrito-routing.module';

import { DetailsCarritoPage } from './details-carrito.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsCarritoPageRoutingModule
  ],
  declarations: [DetailsCarritoPage]
})
export class DetailsCarritoPageModule {}
