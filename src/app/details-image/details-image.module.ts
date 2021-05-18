import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsImagePageRoutingModule } from './details-image-routing.module';

import { DetailsImagePage } from './details-image.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsImagePageRoutingModule
  ],
  declarations: [DetailsImagePage]
})
export class DetailsImagePageModule {}
