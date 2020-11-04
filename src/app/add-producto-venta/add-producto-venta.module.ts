import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProductoVentaPageRoutingModule } from './add-producto-venta-routing.module';

import { AddProductoVentaPage } from './add-producto-venta.page';
import { ComponentsModule } from '../Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    AddProductoVentaPageRoutingModule
  ],
  declarations: [AddProductoVentaPage]
})
export class AddProductoVentaPageModule {}
