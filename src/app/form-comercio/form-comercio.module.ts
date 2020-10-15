import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormComercioPageRoutingModule } from './form-comercio-routing.module';

import { FormComercioPage } from './form-comercio.page';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ComponentsModule } from '../Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ImageCropperModule,
    FormComercioPageRoutingModule
  ],
  declarations: [
    FormComercioPage
  ]
})
export class FormComercioPageModule {}
