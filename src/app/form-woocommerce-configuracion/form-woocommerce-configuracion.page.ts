import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Comercio } from '../models/comercio';
import { ComerciosService } from '../Services/comercios.service';

@Component({
  selector: 'app-form-woocommerce-configuracion',
  templateUrl: './form-woocommerce-configuracion.page.html',
  styleUrls: ['./form-woocommerce-configuracion.page.scss'],
})
export class FormWoocommerceConfiguracionPage implements OnInit {

  public comercio:Comercio

  public url
  public consumerKey
  public consumerSecret

  constructor(
    private comerciosService:ComerciosService,
    private navCtrl:NavController
  ) { 
    this.comercio = new Comercio()
  }

  ngOnInit() {
    this.comercio = this.comerciosService.getSelectedCommerceValue()
    
  }

  cancelar(){
    this.navCtrl.back()
  }

  guardar(){

    this.comerciosService.update(this.comercio).then(data=>{
      console.log(data)
    });
    this.navCtrl.back()
  }

}
