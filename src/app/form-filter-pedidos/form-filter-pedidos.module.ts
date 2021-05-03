import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormFilterPedidosPageRoutingModule } from './form-filter-pedidos-routing.module';

import { FormFilterPedidosPage } from './form-filter-pedidos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormFilterPedidosPageRoutingModule
  ],
  declarations: [FormFilterPedidosPage]
})
export class FormFilterPedidosPageModule {}
