import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormStockPageRoutingModule } from './form-stock-routing.module';

import { FormStockPage } from './form-stock.page';
import { ComponentsModule } from '../Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    FormStockPageRoutingModule
  ],
  declarations: [FormStockPage]
})
export class FormStockPageModule {}
