import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WCProduct } from 'src/app/models/woocommerce/product';

@Component({
  selector: 'app-card-producto-woocommerce',
  templateUrl: './card-producto-woocommerce.component.html',
  styleUrls: ['./card-producto-woocommerce.component.scss'],
})
export class CardProductoWoocommerceComponent implements OnInit {

  @Input() item:WCProduct;
  @Output() select = new EventEmitter<any>();
  
  constructor() {
    this.item = new WCProduct()    
  }

  ngOnInit() {}

  seleccionar(){
    this.select.emit();
  }

}
