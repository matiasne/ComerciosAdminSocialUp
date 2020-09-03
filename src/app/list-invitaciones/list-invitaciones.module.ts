import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListInvitacionesPageRoutingModule } from './list-invitaciones-routing.module';

import { ListInvitacionesPage } from './list-invitaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListInvitacionesPageRoutingModule
  ],
  declarations: [ListInvitacionesPage]
})
export class ListInvitacionesPageModule {}
