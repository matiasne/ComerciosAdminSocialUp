import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectMesaPageRoutingModule } from './select-mesa-routing.module';

import { SelectMesaPage } from './select-mesa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectMesaPageRoutingModule
  ],
  declarations: [SelectMesaPage]
})
export class SelectMesaPageModule {}
