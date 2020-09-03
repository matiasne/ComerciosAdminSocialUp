import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddServicioSubscripcionPageRoutingModule } from './add-servicio-subscripcion-routing.module';

import { AddServicioSubscripcionPage } from './add-servicio-subscripcion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddServicioSubscripcionPageRoutingModule
  ],
  declarations: [AddServicioSubscripcionPage]
})
export class AddServicioSubscripcionPageModule {}
