import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { Carrito } from 'src/app/models/carrito';
import { Producto } from 'src/app/models/producto';

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
    
    producto.gruposOpciones.forEach(grupo =>{
      grupo.opciones.forEach(opcion => {
        if(opcion.cantidad > 0){               
          var opcionSeleccionada   = {
            nombreGrupo : grupo.nombre,
            nombre : opcion.nombre,
            precioVariacion : opcion.precioVariacion,
            cantidad : opcion.cantidad,
          }
          console.log(producto);
          producto.opcionesSeleccionadas.push(opcionSeleccionada);
          opcion.cantidad = 0;
        }
      });
    })   
   
    producto.gruposOpciones =[];
    this.carrito.totalProductos += Number(producto.precioTotal);
    this.carrito.productos.push(producto);

    console.log(this.carrito.productos)

    this.carrito.on = true;    
    this.actualCarritoSubject.next(this.carrito);    
  }

  public cargarProductosAMesa(){
    
    
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
