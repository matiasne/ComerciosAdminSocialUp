import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormNotaPageRoutingModule } from './form-nota-routing.module';

import { FormNotaPage } from './form-nota.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormNotaPageRoutingModule
  ],
  declarations: [FormNotaPage]
})
export class FormNotaPageModule {}
