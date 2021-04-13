import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormWoocommerceConfiguracionPageRoutingModule } from './form-woocommerce-configuracion-routing.module';

import { FormWoocommerceConfiguracionPage } from './form-woocommerce-configuracion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormWoocommerceConfiguracionPageRoutingModule
  ],
  declarations: [FormWoocommerceConfiguracionPage]
})
export class FormWoocommerceConfiguracionPageModule {}
