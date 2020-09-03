import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormProductoGrupoOpcionesPageRoutingModule } from './form-producto-grupo-opciones-routing.module';

import { FormProductoGrupoOpcionesPage } from './form-producto-grupo-opciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormProductoGrupoOpcionesPageRoutingModule
  ],
  declarations: [FormProductoGrupoOpcionesPage]
})
export class FormProductoGrupoOpcionesPageModule {}
