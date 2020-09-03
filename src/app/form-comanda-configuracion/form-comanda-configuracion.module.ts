import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormComandaConfiguracionPageRoutingModule } from './form-comanda-configuracion-routing.module';

import { FormComandaConfiguracionPage } from './form-comanda-configuracion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormComandaConfiguracionPageRoutingModule
  ],
  declarations: [FormComandaConfiguracionPage]
})
export class FormComandaConfiguracionPageModule {}
