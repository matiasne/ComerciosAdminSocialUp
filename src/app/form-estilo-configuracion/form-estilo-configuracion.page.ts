import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Comercio } from '../Models/comercio';
import { ComerciosService } from '../Services/comercios.service';

@Component({
  selector: 'app-form-estilo-configuracion',
  templateUrl: './form-estilo-configuracion.page.html',
  styleUrls: ['./form-estilo-configuracion.page.scss'],
})
export class FormEstiloConfiguracionPage implements OnInit {

  public comercio:Comercio = new Comercio();
  constructor(
    private comerciosService:ComerciosService,
    private navCtrl:NavController
  ) { 
    this.comercio = this.comerciosService.comercio;
  }

  ngOnInit() {
  }

  guardar(){
    this.comerciosService.update(this.comercio);
    this.navCtrl.back();
  }

  cancelar(){
    this.navCtrl.back();
  }
}
