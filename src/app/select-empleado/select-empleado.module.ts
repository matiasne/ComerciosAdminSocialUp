import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectEmpleadoPageRoutingModule } from './select-empleado-routing.module';

import { SelectEmpleadoPage } from './select-empleado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectEmpleadoPageRoutingModule
  ],
  declarations: [SelectEmpleadoPage]
})
export class SelectEmpleadoPageModule {}
