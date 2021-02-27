import { NgModule } from '@angular/core';
import { SeleccionarImagenComponent } from '../Components/seleccionar-imagen/seleccionar-imagen.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { IonicModule } from '@ionic/angular';
import { CardSubscriptionComponent } from './card-subscription/card-subscription.component';
import { CardProductoComponent } from './card-producto/card-producto.component';
import { CardUsuarioComponent } from './card-usuario/card-usuario.component';
import { CardPedidoComponent } from './card-pedido/card-pedido.component';
import { CardComandaV2Component } from './card-comanda-v2/card-comanda-v2.component';



@NgModule({
imports: [
    CommonModule,    
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ImageCropperModule,
    ],
  declarations: [
    SeleccionarImagenComponent,
    CardComandaV2Component,
    CardUsuarioComponent,
    CardProductoComponent,
    CardSubscriptionComponent,
    CardPedidoComponent
  ],
  exports: [
    SeleccionarImagenComponent,
    CardComandaV2Component,
    CardUsuarioComponent,
    CardProductoComponent,
    CardSubscriptionComponent,
    CardPedidoComponent 
    
  ]
})
export class ComponentsModule {}