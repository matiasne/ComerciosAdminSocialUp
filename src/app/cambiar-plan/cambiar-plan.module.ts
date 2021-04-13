import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambiarPlanPageRoutingModule } from './cambiar-plan-routing.module';

import { CambiarPlanPage } from './cambiar-plan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambiarPlanPageRoutingModule
  ],
  declarations: [CambiarPlanPage]
})
export class CambiarPlanPageModule {}
