import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormEgresoCajaPageRoutingModule } from './form-egreso-caja-routing.module';

import { FormEgresoCajaPage } from './form-egreso-caja.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormEgresoCajaPageRoutingModule
  ],
  declarations: [FormEgresoCajaPage]
})
export class FormEgresoCajaPageModule {}
