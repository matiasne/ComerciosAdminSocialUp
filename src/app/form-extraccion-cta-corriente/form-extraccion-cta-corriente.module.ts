import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormExtraccionCtaCorrientePageRoutingModule } from './form-extraccion-cta-corriente-routing.module';

import { FormExtraccionCtaCorrientePage } from './form-extraccion-cta-corriente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormExtraccionCtaCorrientePageRoutingModule
  ],
  declarations: [FormExtraccionCtaCorrientePage]
})
export class FormExtraccionCtaCorrientePageModule {}
