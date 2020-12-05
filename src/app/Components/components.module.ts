import { NgModule } from '@angular/core';
import { SeleccionarImagenComponent } from '../Components/seleccionar-imagen/seleccionar-imagen.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { IonicModule } from '@ionic/angular';
import { CardComandaComponent } from './card-comanda/card-comanda.component';
import { CardSubscriptionComponent } from './card-subscription/card-subscription.component';
import { CardProductoComponent } from './card-producto/card-producto.component';
import { CardUsuarioComponent } from './card-usuario/card-usuario.component';



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
    CardComandaComponent,
    CardUsuarioComponent,
    CardProductoComponent,
    CardSubscriptionComponent
    
  ],
  exports: [
    SeleccionarImagenComponent,
    CardComandaComponent,
    CardUsuarioComponent,
    CardProductoComponent,
    CardSubscriptionComponent
    
  ]
})
export class ComponentsModule {}