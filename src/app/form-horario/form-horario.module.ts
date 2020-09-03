import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormHorarioPageRoutingModule } from './form-horario-routing.module';

import { FormHorarioPage } from './form-horario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormHorarioPageRoutingModule
  ],
  declarations: [FormHorarioPage]
})
export class FormHorarioPageModule {}
