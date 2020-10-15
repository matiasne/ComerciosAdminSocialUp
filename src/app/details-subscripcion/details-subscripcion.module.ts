import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsSubscripcionPageRoutingModule } from './details-subscripcion-routing.module';

import { DetailsSubscripcionPage } from './details-subscripcion.page';
import { ComponentsModule } from '../Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    DetailsSubscripcionPageRoutingModule
  ],
  declarations: [DetailsSubscripcionPage]
})
export class DetailsSubscripcionPageModule {}
