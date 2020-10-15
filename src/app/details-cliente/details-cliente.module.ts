import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsClientePageRoutingModule } from './details-cliente-routing.module';

import { DetailsClientePage } from './details-cliente.page';
import { ComponentsModule } from '../Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    DetailsClientePageRoutingModule
  ],
  declarations: [DetailsClientePage]
})
export class DetailsClientePageModule {}
