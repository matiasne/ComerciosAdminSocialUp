import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsPedidoWoocommercePageRoutingModule } from './details-pedido-woocommerce-routing.module';

import { DetailsPedidoWoocommercePage } from './details-pedido-woocommerce.page';
import { ComponentsModule } from '../Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    DetailsPedidoWoocommercePageRoutingModule
  ],
  declarations: [DetailsPedidoWoocommercePage]
})
export class DetailsPedidoWoocommercePageModule {}
