import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListComandasPageRoutingModule } from './list-comandas-routing.module';

import { ListComandasPage } from './list-comandas.page';
import { ComponentsModule } from '../Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    ListComandasPageRoutingModule
  ],
  declarations: [ListComandasPage]
})
export class ListComandasPageModule {}
