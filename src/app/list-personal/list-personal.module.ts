import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPersonalPageRoutingModule } from './list-personal-routing.module';

import { ListPersonalPage } from './list-personal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPersonalPageRoutingModule
  ],
  declarations: [ListPersonalPage]
})
export class ListPersonalPageModule {}
