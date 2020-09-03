import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormIngresoCajaPageRoutingModule } from './form-ingreso-caja-routing.module';

import { FormIngresoCajaPage } from './form-ingreso-caja.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormIngresoCajaPageRoutingModule
  ],
  declarations: [FormIngresoCajaPage]
})
export class FormIngresoCajaPageModule {}
