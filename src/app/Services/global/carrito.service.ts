import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { Carrito } from 'src/app/models/carrito';
import { Producto } from 'src/app/models/producto';
import { Descuento, EnumTipoDescuento } from 'src/app/models/descuento';
import { EnumTipoRecargo, Recargo } from 'src/app/models/recargo';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  public carrito:Carrito;
  
  public actualCarritoSubject = new BehaviorSubject<any>("");

  constructor(
    private authenticationService:AuthenticationService
  ) { 
    this.carrito = new Carrito(
      this.authenticationService.getUID(),this.authenticationService.getNombre()
    );
    this.actualCarritoSubject.next(this.carrito);
  }

  public getActualCarritoSubs(){
    return this.actualCarritoSubject.asObservable();
  }

  public agregarComanda(comanda){
    this.carrito = comanda.carrito;
    this.carrito.comandaId = comanda.id;
  }

  public agregarPedido(pedido){
    pedido.productos.forEach(producto =>{
      this.agregarProducto(producto);
    });
    this.carrito.pedido = pedido; 
  }

  public agregarProducto(producto:Producto){          
   
    producto.gruposOpciones =[];
    this.carrito.totalProductos += Number(producto.precioTotal);
    this.carrito.productos.push(producto);

    console.log(this.carrito.productos)

    this.carrito.on = true;    
    this.actualCarritoSubject.next(this.carrito);    
  }

  public cargarProductosAMesa(){
    
    
  }

  public agregarDescuento(descuento:Descuento){
    this.carrito.descuentos.push(descuento)
  }

  public agregarRecargo(recargo:Recargo){
    this.carrito.recargos.push(recargo)
  }

/*
  public agregarPagare(pagare){
    this.carrito.pagare = pagare;
    this.carrito.totalServicios += Number(pagare.monto);
    this.carrito.on = true;    
    this.actualCarritoSubject.next(this.carrito);    
  }*/

  /*
  public agregarDeposito(deposito){
    this.carrito.deposito = deposito;
    this.carrito.on = true;    
    this.actualCarritoSubject.next(this.carrito);  
  }*/

  public agregarServicio(servicio,precio){     
    this.carrito.totalServicios += precio;
    this.carrito.servicios.push(servicio);
    this.carrito.on = true;     
    console.log(this.carrito);
    this.actualCarritoSubject.next(this.carrito);    
  }

  public eliminarDescuento(index){
    this.carrito.descuentos.splice(index,1)
  }

  public eliminarRecargo(index){
    this.carrito.recargos.splice(index,1)
  }

  public eliminarProducto(index){
    this.carrito.totalProductos -= Number(this.carrito.productos[index].precioTotal);
    this.carrito.productos.splice(index,1);
    if(this.carrito.productos.length > 0 || this.carrito.servicios.length > 0)
      this.carrito.on = true;    
    else{
      this.carrito.on = false;
    }
    this.actualCarritoSubject.next(this.carrito);    
  }

  public eliminarServicio(index){
    var servicio = this.carrito.servicios[index];        
    this.carrito.totalServicios -= Number(servicio.plan.precio);
    this.carrito.servicios.splice(index,1);

    if(this.carrito.productos.length > 0 || this.carrito.servicios.length > 0)
      this.carrito.on = true;    
    else{
      this.carrito.on = false;
    }
    this.actualCarritoSubject.next(this.carrito);    
  }

  public getTotal(){
 
    let total = this.carrito.totalProductos + this.carrito.totalServicios;

    let totalPorcentaje = 0;
    this.carrito.descuentos.forEach(descuento =>{
      if(descuento.tipo == EnumTipoDescuento.porcentaje){
        totalPorcentaje += Number(descuento.monto)
      }
    })

    let descontar = (total*totalPorcentaje)/100;

    total = total-descontar;

    let totalMonto = 0;
    this.carrito.descuentos.forEach(descuento =>{
      if(descuento.tipo == EnumTipoDescuento.monto){
        totalMonto += Number(descuento.monto)
      }
    })

    total = total-totalMonto;



    totalPorcentaje = 0;
    this.carrito.recargos.forEach(recargo =>{
      if(recargo.tipo == EnumTipoRecargo.porcentaje){
        totalPorcentaje += Number(recargo.monto)
      }
    })

    let sumar = (total*totalPorcentaje)/100;

    total = total+sumar;

    totalMonto = 0;
    this.carrito.recargos.forEach(recargo =>{
      if(recargo.tipo == EnumTipoRecargo.monto){
        totalMonto += Number(recargo.monto)
      }
    })

    total = total+totalMonto;


    return total;




  }

  setearCliente(cliente){
    this.carrito.cliente = cliente;   
    if(this.carrito.cliente.keywords)
      delete this.carrito.cliente.keywords;      
    console.log(this.carrito.cliente)
    this.actualCarritoSubject.next(this.carrito); 
  }

  setearMesa(mesa){
    this.carrito.mesa = mesa;
    console.log(this.carrito.mesa)
    this.actualCarritoSubject.next(this.carrito);
  }

  

  vaciar(){ 
      this.carrito = new Carrito(this.authenticationService.getUID(),this.authenticationService.getNombre());
      this.actualCarritoSubject.next(this.carrito);   
     

    
  }
}
