import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsMesaPageRoutingModule } from './details-mesa-routing.module';

import { DetailsMesaPage } from './details-mesa.page';
import { ComponentsModule } from '../Components/components.module';

@NgModule({ 
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    DetailsMesaPageRoutingModule,
  ],
  declarations: [DetailsMesaPage]
})
export class DetailsMesaPageModule {}
