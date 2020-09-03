import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListHorariosPageRoutingModule } from './list-horarios-routing.module';

import { ListHorariosPage } from './list-horarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListHorariosPageRoutingModule
  ],
  declarations: [ListHorariosPage]
})
export class ListHorariosPageModule {}
