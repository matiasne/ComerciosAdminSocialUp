import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EnumTipoRecargo, Recargo } from '../models/recargo';
import { CarritoService } from '../Services/global/carrito.service';

@Component({
  selector: 'app-form-recargo',
  templateUrl: './form-recargo.page.html',
  styleUrls: ['./form-recargo.page.scss'],
})
export class FormRecargoPage implements OnInit {

  
  public recargo:Recargo
  public enumTipo = EnumTipoRecargo

  constructor(
    private modalCtrl: ModalController,
    private carritoService:CarritoService
    ) { 
      this.recargo = new Recargo();
    }

  ngOnInit() {
  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

  agregar(){
    if(this.recargo.monto){
      this.carritoService.agregarRecargo(this.recargo);  
    }
    this.modalCtrl.dismiss();
  }

}
