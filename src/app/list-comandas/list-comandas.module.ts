import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListComandasPageRoutingModule } from './list-comandas-routing.module';

import { ListComandasPage } from './list-comandas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListComandasPageRoutingModule
  ],
  declarations: [ListComandasPage]
})
export class ListComandasPageModule {}
