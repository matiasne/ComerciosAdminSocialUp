import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormCierreCajaPageRoutingModule } from './form-cierre-caja-routing.module';

import { FormCierreCajaPage } from './form-cierre-caja.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormCierreCajaPageRoutingModule
  ],
  declarations: [FormCierreCajaPage]
})
export class FormCierreCajaPageModule {}
