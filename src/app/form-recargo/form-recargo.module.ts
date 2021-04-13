import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormRecargoPageRoutingModule } from './form-recargo-routing.module';

import { FormRecargoPage } from './form-recargo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormRecargoPageRoutingModule
  ],
  declarations: [FormRecargoPage]
})
export class FormRecargoPageModule {}
