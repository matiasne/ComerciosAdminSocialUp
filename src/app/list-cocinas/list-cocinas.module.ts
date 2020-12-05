import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListCocinasPageRoutingModule } from './list-cocinas-routing.module';

import { ListCocinasPage } from './list-cocinas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListCocinasPageRoutingModule
  ],
  declarations: [ListCocinasPage]
})
export class ListCocinasPageModule {}
