import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardComandasPageRoutingModule } from './dashboard-comandas-routing.module';

import { DashboardComandasPage } from './dashboard-comandas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardComandasPageRoutingModule
  ],
  declarations: [DashboardComandasPage]
})
export class DashboardComandasPageModule {}
