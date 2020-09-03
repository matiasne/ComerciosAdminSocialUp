import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormCajaPageRoutingModule } from './form-caja-routing.module';

import { FormCajaPage } from './form-caja.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormCajaPageRoutingModule
  ],
  declarations: [FormCajaPage]
})
export class FormCajaPageModule {}
