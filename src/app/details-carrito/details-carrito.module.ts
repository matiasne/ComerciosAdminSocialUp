import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsCarritoPageRoutingModule } from './details-carrito-routing.module';

import { DetailsCarritoPage } from './details-carrito.page';
import { ComponentsModule } from '../Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    DetailsCarritoPageRoutingModule
  ],
  declarations: [DetailsCarritoPage]
})
export class DetailsCarritoPageModule {}
