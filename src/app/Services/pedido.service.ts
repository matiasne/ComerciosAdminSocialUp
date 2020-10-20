import { Injectable } from '@angular/core';
import { Pedido } from 'src/app/models/pedido';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { OpcionSeleccionada } from 'src/app/models/opcionSeleccionada';
import * as firebase from 'firebase';
import { NotificacionesService } from './notificaciones.service';
import { ComerciosService } from './comercios.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private pedidoActual:Pedido = new Pedido();

  public actualPedidoSubject = new BehaviorSubject<Pedido>(this.pedidoActual);

  public pedidoCalificando:Pedido = new Pedido();

  constructor(
    private firestore: AngularFirestore,
    private auth:AuthenticationService,
    private comerciosService:ComerciosService,
    private notificacionesService:NotificacionesService
  ) {
    this.pedidoActual = new Pedido();
    this.pedidoActual.on = false;
   }

  

  public getPedidoPendienteByCommerce(commerce_id){
    console.log(commerce_id)
    return this.firestore.collection('pedidos', ref => 
      ref.where('comercioId','==',commerce_id).where('estado','<=',3)
       ).snapshotChanges(); 
  }

  public setPedidoRecibido(pedido){
    this.pedidoCalificando = pedido;
    this.firestore.collection("pedidos").doc(pedido.id).update({recibido: 1});
    if(pedido.estado >=3){
      this.borrarPedido(pedido);
    }
  }


  public setPedidoTomado(pedido,minutos){

    console.log("Pedido Tomado");
    
    this.firestore.collection("pedidos").doc(pedido.id).update({estado: 1, demora: minutos});

    if(pedido.clienteId)
      this.notificacionesService.enviarById(pedido.clienteId,"El pedido ha sido tomado!","Su comercio ya está realizando el pedido");
  }

  public setPedidoListo(pedido){


    this.firestore.collection("pedidos").doc(pedido.id).update({estado: 2});

    if(pedido.clienteId)
      this.notificacionesService.enviarById(pedido.clienteId,"El pedido esta listo!","Su comercio ya tiene el pedido listo");

    

    this.comerciosService.getSelectedCommerce().subscribe(data=>{
      let comercio = data;

      if(comercio.rolCadetes.length > 0){
        comercio.rolCadetes.forEach(rolId => {
          this.notificacionesService.enviarByRolId(rolId,"El pedido esta listo!","Tienes un pedido listo para buscar!");
        });        
      }
    });  

  }

  public setPedidoCancelado(pedido){
    this.firestore.collection("pedidos").doc(pedido.id).update({estado: 3});
   
    if(pedido.recibido == 1){
      this.borrarPedido(pedido);
    }
    this.setPedidoNoMostrar(pedido);

    if(pedido.clienteId)
      this.notificacionesService.enviarById(pedido.clienteId,"Pedido Cancelado","")

  }

  public setPedidoEnviado(pedido){

    this.firestore.collection("pedidos").doc(pedido.id).update({estado: 3});
   
    if(pedido.recibido == 1){
      this.borrarPedido(pedido);
    }

    if(pedido.clienteId)
      this.notificacionesService.enviarById(pedido.clienteId,"Pedido en Camino","El cadete está llevando su pedido")
  }

  public setPedidoNoMostrar(pedido){
    this.firestore.collection("pedidos").doc(pedido.id).update({estado: 4});
  }

  public borrarPedido(pedido){
    this.firestore.collection("pedidos").doc(pedido.id).delete();
  }

 

  

  
}
