import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardCajasPageRoutingModule } from './dashboard-cajas-routing.module';

import { DashboardCajasPage } from './dashboard-cajas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardCajasPageRoutingModule
  ],
  declarations: [DashboardCajasPage]
})
export class DashboardCajasPageModule {}
