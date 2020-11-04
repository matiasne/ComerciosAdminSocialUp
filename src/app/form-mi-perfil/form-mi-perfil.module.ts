import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormMiPerfilPageRoutingModule } from './form-mi-perfil-routing.module';

import { FormMiPerfilPage } from './form-mi-perfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormMiPerfilPageRoutingModule
  ],
  declarations: [FormMiPerfilPage]
})
export class FormMiPerfilPageModule {}
