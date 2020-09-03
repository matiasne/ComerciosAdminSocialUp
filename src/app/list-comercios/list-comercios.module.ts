import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListComerciosPageRoutingModule } from './list-comercios-routing.module';

import { ListComerciosPage } from './list-comercios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListComerciosPageRoutingModule
  ],
  declarations: [ListComerciosPage]
})
export class ListComerciosPageModule {}
