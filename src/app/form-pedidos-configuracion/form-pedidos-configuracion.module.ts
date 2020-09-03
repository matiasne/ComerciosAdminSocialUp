import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormPedidosConfiguracionPageRoutingModule } from './form-pedidos-configuracion-routing.module';

import { FormPedidosConfiguracionPage } from './form-pedidos-configuracion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormPedidosConfiguracionPageRoutingModule
  ],
  declarations: [FormPedidosConfiguracionPage]
})
export class FormPedidosConfiguracionPageModule {}
