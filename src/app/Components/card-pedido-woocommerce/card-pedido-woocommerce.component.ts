import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WCOrder } from 'src/app/models/woocommerce/order';

@Component({
  selector: 'app-card-pedido-woocommerce',
  templateUrl: './card-pedido-woocommerce.component.html',
  styleUrls: ['./card-pedido-woocommerce.component.scss'],
})
export class CardPedidoWoocommerceComponent implements OnInit {

  @Input() item:WCOrder;
  @Output() select = new EventEmitter<any>();

  constructor() {
    this.item = new WCOrder(); 
   }

  ngOnInit() {}

  seleccionar(){
    this.select.emit();  
  }

}
