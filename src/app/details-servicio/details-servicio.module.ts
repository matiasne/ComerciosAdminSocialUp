import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsServicioPageRoutingModule } from './details-servicio-routing.module';

import { DetailsServicioPage } from './details-servicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsServicioPageRoutingModule
  ],
  declarations: [DetailsServicioPage]
})
export class DetailsServicioPageModule {}
