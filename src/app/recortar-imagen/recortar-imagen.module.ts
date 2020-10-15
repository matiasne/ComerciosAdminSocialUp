import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecortarImagenPageRoutingModule } from './recortar-imagen-routing.module';

import { RecortarImagenPage } from './recortar-imagen.page';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageCropperModule,
    RecortarImagenPageRoutingModule
  ],
  declarations: []
})
export class RecortarImagenPageModule {}
