import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListSubscripcionesPageRoutingModule } from './list-subscripciones-routing.module';

import { ListSubscripcionesPage } from './list-subscripciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListSubscripcionesPageRoutingModule
  ],
  declarations: [ListSubscripcionesPage]
})
export class ListSubscripcionesPageModule {}
