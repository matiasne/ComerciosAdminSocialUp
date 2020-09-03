import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormClientePageRoutingModule } from './form-cliente-routing.module';

import { FormClientePage } from './form-cliente.page';
import { ComponentsModule } from '../Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    IonicModule,
    FormClientePageRoutingModule
  ],
  declarations: [FormClientePage]
})
export class FormClientePageModule {}
