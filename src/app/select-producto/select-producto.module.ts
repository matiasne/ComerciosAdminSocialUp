import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectProductoPageRoutingModule } from './select-producto-routing.module';

import { SelectProductoPage } from './select-producto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectProductoPageRoutingModule
  ],
  declarations: [SelectProductoPage]
})
export class SelectProductoPageModule {}
