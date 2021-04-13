import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListBeneficiosPageRoutingModule } from './list-beneficios-routing.module';

import { ListBeneficiosPage } from './list-beneficios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListBeneficiosPageRoutingModule
  ],
  declarations: [ListBeneficiosPage]
})
export class ListBeneficiosPageModule {}
