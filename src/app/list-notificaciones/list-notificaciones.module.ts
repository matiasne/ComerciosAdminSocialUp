import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListNotificacionesPageRoutingModule } from './list-notificaciones-routing.module';

import { ListNotificacionesPage } from './list-notificaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListNotificacionesPageRoutingModule
  ],
  declarations: [ListNotificacionesPage]
})
export class ListNotificacionesPageModule {}
