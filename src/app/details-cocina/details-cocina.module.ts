import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsCocinaPageRoutingModule } from './details-cocina-routing.module';

import { DetailsCocinaPage } from './details-cocina.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsCocinaPageRoutingModule
  ],
  declarations: [DetailsCocinaPage]
})
export class DetailsCocinaPageModule {}
