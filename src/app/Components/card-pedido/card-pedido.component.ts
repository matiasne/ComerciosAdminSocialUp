import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EnumEstadoComanda, Pedido } from 'src/app/Models/pedido';

@Component({
  selector: 'app-card-pedido',
  templateUrl: './card-pedido.component.html',
  styleUrls: ['./card-pedido.component.scss'],
})
export class CardPedidoComponent implements OnInit {
 
  @Input() item:any;
  @Output() select = new EventEmitter<any>();
  public pEstado = EnumEstadoComanda;
 
  constructor() { 
    console.log(this.item)

    
    
     

   }

  ngOnInit() { 

  }

  seleccionar(){
    this.select.emit(); 
  }


}
