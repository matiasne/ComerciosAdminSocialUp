import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListVentaPageRoutingModule } from './list-venta-routing.module';

import { ListVentaPage } from './list-venta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListVentaPageRoutingModule
  ],
  declarations: []
})
export class ListVentaPageModule {}
