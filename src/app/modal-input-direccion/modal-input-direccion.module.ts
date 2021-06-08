import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalInputDireccionPageRoutingModule } from './modal-input-direccion-routing.module';

import { ModalInputDireccionPage } from './modal-input-direccion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalInputDireccionPageRoutingModule
  ],
  declarations: [ModalInputDireccionPage]
})
export class ModalInputDireccionPageModule {}
