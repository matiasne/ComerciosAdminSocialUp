import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormSubscripcionPageRoutingModule } from './form-subscripcion-routing.module';

import { FormSubscripcionPage } from './form-subscripcion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormSubscripcionPageRoutingModule
  ],
  declarations: [FormSubscripcionPage]
})
export class FormSubscripcionPageModule {}
