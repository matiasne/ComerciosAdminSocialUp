import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormComercioConfiguracionPageRoutingModule } from './form-comercio-configuracion-routing.module';

import { FormComercioConfiguracionPage } from './form-comercio-configuracion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormComercioConfiguracionPageRoutingModule
  ],
  declarations: [FormComercioConfiguracionPage]
})
export class FormComercioConfiguracionPageModule {}
