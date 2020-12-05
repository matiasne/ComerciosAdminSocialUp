import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormAperturaCajaPageRoutingModule } from './form-apertura-caja-routing.module';

import { FormAperturaCajaPage } from './form-apertura-caja.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormAperturaCajaPageRoutingModule
  ],
  declarations: [FormAperturaCajaPage]
})
export class FormAperturaCajaPageModule {}
