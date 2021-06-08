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
import { ModalNotificacionService } from '../modal-notificacion.service';
import { ComentariosService } from '../comentarios.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Comentario } from 'src/app/models/comentario';
import { ImpresoraService } from '../impresora.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  public carrito:Pedido;

  public comentario = "";
  
  public actualCarritoSubject = new BehaviorSubject<any>("");

  constructor(
    private authenticationService:AuthenticationService,
    private pedidosService:PedidoService,
    private modalNotificacion:ModalNotificacionService,
    private comentariosService:ComentariosService,
    private firestore: AngularFirestore,
    private impresoraService:ImpresoraService,
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

    this.modalNotificacion.success("Agregado",producto.cantidad+' '+producto.unidad+' de '+producto.nombre)
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

  agregarComentario(){

  }

  

  vaciar(){ 
      this.carrito = new Pedido()
      this.carrito.on = false;    
      this.actualCarritoSubject.next(this.carrito);       
  }

  getTotal(){
    return this.pedidosService.getTotal(this.carrito)
  }

  crearPedido(){
    this.carrito.id = this.firestore.createId();
    this.carrito.personalId = this.authenticationService.getUID();
    this.carrito.personalEmail = this.authenticationService.getEmail();
    this.carrito.personalNombre = this.authenticationService.getNombre();
    
    
    this.impresoraService.impresionComanda(this.carrito)
    
    
    
    if(this.comentario != ""){ 
      this.comentariosService.setearPath("pedidos",this.carrito.id);      
      let comentario = new Comentario();
      comentario.text =this.comentario;
      comentario.senderId=this.authenticationService.getUID();
      comentario.senderEmail =this.authenticationService.getEmail();
      this.comentariosService.add(comentario).then(data=>{
        console.log("comentario agregado")
      })
    }  

    let c:any = new Pedido()  //NO borrar!!! importante para cuando está en modo offline!!!
    Object.assign(c, this.carrito);
    this.vaciar();  

    c.direccion = JSON.parse(JSON.stringify(c.direccion));
    

    this.pedidosService.add(c).then((data:any)=>{       
      console.log("!!!!!!"+data.fromCache)      
    });  
    this.modalNotificacion.success("Cargado","El pedido ha sido cargado a la lista.")
  }
}
