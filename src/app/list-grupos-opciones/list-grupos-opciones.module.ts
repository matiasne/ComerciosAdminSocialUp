import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListGruposOpcionesPageRoutingModule } from './list-grupos-opciones-routing.module';

import { ListGruposOpcionesPage } from './list-grupos-opciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListGruposOpcionesPageRoutingModule
  ],
  declarations: [ListGruposOpcionesPage]
})
export class ListGruposOpcionesPageModule {}
