import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormBeneficioPageRoutingModule } from './form-beneficio-routing.module';

import { FormBeneficioPage } from './form-beneficio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormBeneficioPageRoutingModule
  ],
  declarations: [FormBeneficioPage]
})
export class FormBeneficioPageModule {}
