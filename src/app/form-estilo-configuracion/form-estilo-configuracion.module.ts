import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormEstiloConfiguracionPageRoutingModule } from './form-estilo-configuracion-routing.module';

import { FormEstiloConfiguracionPage } from './form-estilo-configuracion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormEstiloConfiguracionPageRoutingModule
  ],
  declarations: [FormEstiloConfiguracionPage]
})
export class FormEstiloConfiguracionPageModule {}
