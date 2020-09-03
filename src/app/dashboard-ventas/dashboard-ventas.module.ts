import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardVentasPageRoutingModule } from './dashboard-ventas-routing.module';

import { DashboardVentasPage } from './dashboard-ventas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardVentasPageRoutingModule
  ],
  declarations: [DashboardVentasPage]
})
export class DashboardVentasPageModule {}
