import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardProductosPageRoutingModule } from './dashboard-productos-routing.module';

import { DashboardProductosPage } from './dashboard-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardProductosPageRoutingModule
  ],
  declarations: [DashboardProductosPage]
})
export class DashboardProductosPageModule {}
