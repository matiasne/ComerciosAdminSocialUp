import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormClienteEstadoPageRoutingModule } from './form-cliente-estado-routing.module';

import { FormClienteEstadoPage } from './form-cliente-estado.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    FormClienteEstadoPageRoutingModule
  ],
  declarations: [FormClienteEstadoPage]
})
export class FormClienteEstadoPageModule {}
