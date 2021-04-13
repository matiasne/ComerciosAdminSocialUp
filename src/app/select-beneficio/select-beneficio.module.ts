import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectBeneficioPageRoutingModule } from './select-beneficio-routing.module';

import { SelectBeneficioPage } from './select-beneficio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectBeneficioPageRoutingModule
  ],
  declarations: [SelectBeneficioPage]
})
export class SelectBeneficioPageModule {}
