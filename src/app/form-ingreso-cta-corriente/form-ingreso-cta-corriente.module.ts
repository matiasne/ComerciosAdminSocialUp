import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormIngresoCtaCorrientePageRoutingModule } from './form-ingreso-cta-corriente-routing.module';

import { FormIngresoCtaCorrientePage } from './form-ingreso-cta-corriente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormIngresoCtaCorrientePageRoutingModule
  ],
  declarations: [FormIngresoCtaCorrientePage]
})
export class FormIngresoCtaCorrientePageModule {}
