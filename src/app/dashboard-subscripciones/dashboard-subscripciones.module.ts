import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardSubscripcionesPageRoutingModule } from './dashboard-subscripciones-routing.module';

import { DashboardSubscripcionesPage } from './dashboard-subscripciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardSubscripcionesPageRoutingModule
  ],
  declarations: [DashboardSubscripcionesPage]
})
export class DashboardSubscripcionesPageModule {}
