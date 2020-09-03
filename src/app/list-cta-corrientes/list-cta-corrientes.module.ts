import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListCtaCorrientesPageRoutingModule } from './list-cta-corrientes-routing.module';

import { ListCtaCorrientesPage } from './list-cta-corrientes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListCtaCorrientesPageRoutingModule
  ],
  declarations: [ListCtaCorrientesPage]
})
export class ListCtaCorrientesPageModule {}
