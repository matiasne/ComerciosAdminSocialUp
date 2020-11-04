import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormMiPerfilPage } from './form-mi-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: FormMiPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormMiPerfilPageRoutingModule {}
