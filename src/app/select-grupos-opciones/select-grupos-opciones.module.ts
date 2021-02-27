import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectGruposOpcionesPageRoutingModule } from './select-grupos-opciones-routing.module';

import { SelectGruposOpcionesPage } from './select-grupos-opciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectGruposOpcionesPageRoutingModule
  ],
  declarations: [SelectGruposOpcionesPage]
})
export class SelectGruposOpcionesPageModule {}
