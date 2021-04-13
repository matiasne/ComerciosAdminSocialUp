import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComandaPageRoutingModule } from './comanda-routing.module';

import { ComandaPage } from './comanda.page';
import { ComponentsModule } from 'src/app/Components/components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    ComandaPageRoutingModule
  ],
  declarations: [ComandaPage]
})
export class ComandaPageModule {}
