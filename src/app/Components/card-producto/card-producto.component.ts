import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card-producto',
  templateUrl: './card-producto.component.html',
  styleUrls: ['./card-producto.component.scss'],
})
export class CardProductoComponent implements OnInit {

  @Input() item:any;
  @Input() multiplicador:number; 
  @Input() showImage= true;
  @Input() showStock = true;
  @Input() showOpcionesSeleccionadas = true;
  @Input() showEnCarrito = true;
  @Output() select = new EventEmitter<any>();
    
  constructor() { 
   
  }

  ngOnInit() {
    if(this.item.cantidad == 0)
      this.item.cantidad = 1;
    }

  seleccionar(){
    this.select.emit();
  }

}
