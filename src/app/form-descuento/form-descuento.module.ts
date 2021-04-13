import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormDescuentoPageRoutingModule } from './form-descuento-routing.module';

import { FormDescuentoPage } from './form-descuento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormDescuentoPageRoutingModule
  ],
  declarations: [FormDescuentoPage]
})
export class FormDescuentoPageModule {}
