import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListCajasPageRoutingModule } from './list-cajas-routing.module';

import { ListCajasPage } from './list-cajas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListCajasPageRoutingModule
  ],
  declarations: [ListCajasPage]
})
export class ListCajasPageModule {}
