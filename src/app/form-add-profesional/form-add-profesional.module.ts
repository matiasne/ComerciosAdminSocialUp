import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormAddProfesionalPageRoutingModule } from './form-add-profesional-routing.module';

import { FormAddProfesionalPage } from './form-add-profesional.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormAddProfesionalPageRoutingModule
  ],
  declarations: [FormAddProfesionalPage]
})
export class FormAddProfesionalPageModule {}
