import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormCalendarioPageRoutingModule } from './form-calendario-routing.module';

import { FormCalendarioPage } from './form-calendario.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    FormCalendarioPageRoutingModule
  ],
  declarations: [FormCalendarioPage]
})
export class FormCalendarioPageModule {}
