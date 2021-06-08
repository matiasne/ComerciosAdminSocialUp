import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalNotificacionPageRoutingModule } from './modal-notificacion-routing.module';

import { ModalNotificacionPage } from './modal-notificacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalNotificacionPageRoutingModule
  ],
  declarations: [ModalNotificacionPage]
})
export class ModalNotificacionPageModule {}
