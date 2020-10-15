import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListComerciosOwnerPageRoutingModule } from './list-comercios-owner-routing.module';

import { ListComerciosOwnerPage } from './list-comercios-owner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListComerciosOwnerPageRoutingModule
  ],
  declarations: []
})
export class ListComerciosOwnerPageModule {}
