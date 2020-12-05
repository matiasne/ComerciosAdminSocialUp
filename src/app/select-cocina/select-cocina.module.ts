import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectCocinaPageRoutingModule } from './select-cocina-routing.module';

import { SelectCocinaPage } from './select-cocina.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectCocinaPageRoutingModule
  ],
  declarations: [SelectCocinaPage]
})
export class SelectCocinaPageModule {}
