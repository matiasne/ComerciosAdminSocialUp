import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListEmpleadosPageRoutingModule } from './list-empleados-routing.module';

import { ListEmpleadosPage } from './list-empleados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListEmpleadosPageRoutingModule
  ],
  declarations: [ListEmpleadosPage]
})
export class ListEmpleadosPageModule {}
