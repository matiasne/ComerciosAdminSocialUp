import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvitarUsuarioPageRoutingModule } from './invitar-usuario-routing.module';

import { InvitarUsuarioPage } from './invitar-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvitarUsuarioPageRoutingModule
  ],
  declarations: [InvitarUsuarioPage]
})
export class InvitarUsuarioPageModule {}
