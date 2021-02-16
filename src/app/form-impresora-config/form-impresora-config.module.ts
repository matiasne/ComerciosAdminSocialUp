import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormImpresoraConfigPageRoutingModule } from './form-impresora-config-routing.module';

import { FormImpresoraConfigPage } from './form-impresora-config.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    FormImpresoraConfigPageRoutingModule
  ],
  declarations: [FormImpresoraConfigPage]
})
export class FormImpresoraConfigPageModule {}
