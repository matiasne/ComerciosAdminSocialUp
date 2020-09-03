import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormProductoOpcionPageRoutingModule } from './form-producto-opcion-routing.module';

import { FormProductoOpcionPage } from './form-producto-opcion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormProductoOpcionPageRoutingModule
  ],
  declarations: [FormProductoOpcionPage]
})
export class FormProductoOpcionPageModule {}
