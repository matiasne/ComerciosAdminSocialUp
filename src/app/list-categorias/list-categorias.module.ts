import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListCategoriasPageRoutingModule } from './list-categorias-routing.module';

import { ListCategoriasPage } from './list-categorias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListCategoriasPageRoutingModule
  ],
  declarations: [ListCategoriasPage]
})
export class ListCategoriasPageModule {}
