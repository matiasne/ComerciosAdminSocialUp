import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { Producto } from 'src/app/models/producto';
import { Descuento, EnumTipoDescuento } from 'src/app/models/descuento';
import { EnumTipoRecargo, Recargo } from 'src/app/models/recargo';
import { PedidoService } from '../pedido.service';
import { Pedido } from 'src/app/models/pedido';
import { Mesa } from 'src/app/models/mesa';
import { Cliente } from 'src/app/models/cliente';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  public carrito:Pedido;
  
  public actualCarritoSubject = new BehaviorSubject<any>("");

  constructor(
    private authenticationService:AuthenticationService,
    private pedidoService:PedidoService
  ) { 
    this.carrito = new Pedido();
    this.actualCarritoSubject.next(this.carrito);
  }

  public getActualCarritoSubs(){
    return this.actualCarritoSubject.asObservable();
  }

  public agregarProducto(producto:Producto){         
    producto.enCarrito += producto.cantidad;
    const p = JSON.parse(JSON.stringify(producto));

    p.gruposOpciones =[];
    this.carrito.productos.push(p);
    this.carrito.on = true;    
    this.actualCarritoSubject.next(this.carrito);    
  }

  public agregarDescuento(descuento:Descuento){

    const d = JSON.parse(JSON.stringify(descuento));

    this.carrito.descuentos.push(d)
    this.carrito.on = true;    
    this.actualCarritoSubject.next(this.carrito);    
  }

  public agregarRecargo(recargo:Recargo){

    const r = JSON.parse(JSON.stringify(recargo));

    this.carrito.recargos.push(r)
    this.carrito.on = true;    
    this.actualCarritoSubject.next(this.carrito);    
  }

  public eliminarDescuento(index){
    this.carrito.descuentos.splice(index,1)
    this.carrito.on = true;    
    this.actualCarritoSubject.next(this.carrito);    
  }

  public eliminarRecargo(index){
    this.carrito.recargos.splice(index,1)
    this.carrito.on = true;    
    this.actualCarritoSubject.next(this.carrito);    
  }

  public eliminarProducto(index){
    this.carrito.productos.splice(index,1);
    if(this.carrito.productos.length > 0 || this.carrito.servicios.length > 0)
      this.carrito.on = true;    
    else{
      this.carrito.on = false;
    }
    this.actualCarritoSubject.next(this.carrito);    
  }


  setearCliente(cliente:Cliente){
    this.carrito.cliente = cliente;
    this.carrito.clienteId = cliente.id
    this.carrito.clienteNombre = cliente.nombre
    this.carrito.clienteEmail = cliente.email

    console.log(this.carrito.cliente)
    this.carrito.on = true;    
    this.actualCarritoSubject.next(this.carrito); 
  }

  setearMesa(mesa:Mesa){
    this.carrito.mesaId = mesa.id;
    this.carrito.mesaNombre = mesa.nombre
    this.actualCarritoSubject.next(this.carrito);
  }

  

  vaciar(){ 
      this.carrito = new Pedido()
      this.carrito.on = false;    
      this.actualCarritoSubject.next(this.carrito);       
  }

  getTotal(){
    return this.pedidoService.getTotal(this.carrito)
  }
}
