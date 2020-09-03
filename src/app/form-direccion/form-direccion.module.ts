import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormDireccionPageRoutingModule } from './form-direccion-routing.module';

import { FormDireccionPage } from './form-direccion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormDireccionPageRoutingModule
  ],
  declarations: [FormDireccionPage]
})
export class FormDireccionPageModule {}
