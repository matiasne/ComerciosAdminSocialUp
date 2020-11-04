import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormComentarioPageRoutingModule } from './form-comentario-routing.module';

import { FormComentarioPage } from './form-comentario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormComentarioPageRoutingModule
  ],
  declarations: [FormComentarioPage]
})
export class FormComentarioPageModule {}
