import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListClientesPageRoutingModule } from './list-clientes-routing.module';

import { ListClientesPage } from './list-clientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListClientesPageRoutingModule
  ],
  declarations: []
})
export class ListClientesPageModule {}
