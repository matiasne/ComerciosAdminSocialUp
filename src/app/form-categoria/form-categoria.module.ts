import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormCategoriaPageRoutingModule } from './form-categoria-routing.module';

import { FormCategoriaPage } from './form-categoria.page';
import { SeleccionarImagenComponent } from '../Components/seleccionar-imagen/seleccionar-imagen.component';
import { ComponentsModule } from '../Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    ComponentsModule,
    ReactiveFormsModule,
    IonicModule,
    FormCategoriaPageRoutingModule
  ],
  declarations: [FormCategoriaPage]
})
export class FormCategoriaPageModule {}
