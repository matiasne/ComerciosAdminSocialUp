import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormPlanPageRoutingModule } from './form-plan-routing.module';

import { FormPlanPage } from './form-plan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FormPlanPageRoutingModule
  ],
  declarations: [FormPlanPage]
})
export class FormPlanPageModule {}
