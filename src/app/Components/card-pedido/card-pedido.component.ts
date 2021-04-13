import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as firebase from 'firebase';
import { Comercio } from 'src/app/models/comercio';
import { EnumEstadoComanda, EnumEstadoEnCaja, Pedido } from 'src/app/models/pedido';
import { ComerciosService } from 'src/app/Services/comercios.service';

@Component({
  selector: 'app-card-pedido',
  templateUrl: './card-pedido.component.html',
  styleUrls: ['./card-pedido.component.scss'],
})
export class CardPedidoComponent implements OnInit {
 
  @Input() item:Pedido;
  @Output() select = new EventEmitter<any>();
  public pEstado = EnumEstadoComanda;
  public cEstado = EnumEstadoEnCaja;
  public comercio:Comercio
  constructor(
    private comercioService:ComerciosService
  ) {  
    this.item = new Pedido(); 
    this.item.createdAt = firebase.firestore.Timestamp
    this.comercio = new Comercio()
    this.comercio.asignarValores(this.comercioService.getSelectedCommerceValue())
   } 

  ngOnInit() { 
   
  }

  seleccionar(){
    this.select.emit();  
  }


}
