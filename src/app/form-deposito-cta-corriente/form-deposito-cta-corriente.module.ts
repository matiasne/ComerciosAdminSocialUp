import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormDepositoCtaCorrientePageRoutingModule } from './form-deposito-cta-corriente-routing.module';

import { FormDepositoCtaCorrientePage } from './form-deposito-cta-corriente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormDepositoCtaCorrientePageRoutingModule
  ],
  declarations: [FormDepositoCtaCorrientePage]
})
export class FormDepositoCtaCorrientePageModule {}
