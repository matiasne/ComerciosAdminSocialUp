import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormCtaCorrientePageRoutingModule } from './form-cta-corriente-routing.module';

import { FormCtaCorrientePage } from './form-cta-corriente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormCtaCorrientePageRoutingModule
  ],
  declarations: [FormCtaCorrientePage]
})
export class FormCtaCorrientePageModule {}
