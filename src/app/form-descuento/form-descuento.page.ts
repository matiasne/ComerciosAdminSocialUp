import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Descuento, EnumTipoDescuento } from '../models/descuento';
import { CarritoService } from '../Services/global/carrito.service';

@Component({
  selector: 'app-form-descuento',
  templateUrl: './form-descuento.page.html',
  styleUrls: ['./form-descuento.page.scss'],
})
export class FormDescuentoPage implements OnInit {

  public descuento:Descuento
  public enumTipo = EnumTipoDescuento

  constructor(
    private modalCtrl: ModalController,
    private carritoService:CarritoService
    ) { 
      this.descuento = new Descuento(); 
    }

  ngOnInit() { 
  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

  agregar(){
    if(this.descuento.monto){
      this.modalCtrl.dismiss(this.descuento);
    }   
    else{
      this.modalCtrl.dismiss()
    }
  }

}
