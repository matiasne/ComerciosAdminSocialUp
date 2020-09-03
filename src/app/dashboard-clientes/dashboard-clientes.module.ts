import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardClientesPageRoutingModule } from './dashboard-clientes-routing.module';

import { DashboardClientesPage } from './dashboard-clientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardClientesPageRoutingModule
  ],
  declarations: [DashboardClientesPage]
})
export class DashboardClientesPageModule {}
