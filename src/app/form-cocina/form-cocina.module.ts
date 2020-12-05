import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormCocinaPageRoutingModule } from './form-cocina-routing.module';

import { FormCocinaPage } from './form-cocina.page';
import { ComponentsModule } from '../Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    FormCocinaPageRoutingModule
  ],
  declarations: [FormCocinaPage]
})
export class FormCocinaPageModule {}
