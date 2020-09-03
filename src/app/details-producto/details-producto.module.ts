import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsProductoPageRoutingModule } from './details-producto-routing.module';

import { DetailsProductoPage } from './details-producto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsProductoPageRoutingModule
  ],
  declarations: [DetailsProductoPage]
})
export class DetailsProductoPageModule {}
