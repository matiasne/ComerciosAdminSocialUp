import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { AuthenticationService } from './authentication.service';
import { VentasService } from './ventas.service';
import { BehaviorSubject, Observable, Subscribable, Subscription } from 'rxjs';
import { NotificacionesService } from './notificaciones.service';
import { ComerciosService } from './comercios.service';
import { Comanda } from '../models/comanda';
import { RolesService } from './roles.service';
import { AlertController } from '@ionic/angular';
import { CocinasService } from './cocinas.service';

@Injectable({
  providedIn: 'root'
})
export class ComandasService {

  public comandaCantidad = new BehaviorSubject <any>("");

  constructor(
    private firestore: AngularFirestore,
    private authService:AuthenticationService,
    private notificacionesService:NotificacionesService,
    private comercioService:ComerciosService,
  ) {
    
  }

  getCollection(){
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    return 'comercios/'+comercio_seleccionadoId+'/comandas';
  } 

  getCantidad(): Observable<any>{
    return this.comandaCantidad.asObservable();
  }

  setCantidad(cant){
    this.comandaCantidad.next(cant);
  }

  groupBy(arr, property) {
    return arr.reduce(function(memo, x) {
      if (!memo[x[property]]) { memo[x[property]] = []; }
      memo[x[property]].push(x);
      return memo;
    }, {});
  }
  
 
  public create(pedido) {

    console.log(pedido)
    let cocinas = this.groupBy(pedido.productos, 'cocina');

    Object.keys(cocinas).forEach((cocina) =>{
      //console.log(index) 
      console.log(cocinas[cocina])

      var comanda = new Comanda(this.authService.getUID(),this.authService.getActualUser().displayName,this.authService.getActualUser().email);
      comanda.clienteId = "";
      comanda.clienteNombre = ""; 
      comanda.cocinaId = cocina;
      comanda.pedidoId = pedido.id;

      cocinas[cocina].forEach(p=>{
        comanda.productos.push(JSON.parse(JSON.stringify(p)))
      })    

      if(pedido.clienteId){
        comanda.clienteId = pedido.clienteId;
        comanda.clienteNombre = pedido.clienteNombre;
        comanda.clienteEmail = pedido.clienteEmail;
        this.notificacionesService.enviarById(pedido.clienteId,"Su pedido ha sido comandado!","Revisa tu panel de comandas para Tomarla");
      }

      if(pedido.mesaId){
        comanda.mesaId = pedido.mesaId;
        comanda.mesaNombre = pedido.mesaNombre;
      }

      console.log(comanda)

      this.firestore.collection(this.getCollection()).add( {...comanda,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }); 

      
      
      
    })    
  
    this.comercioService.comercio.rolComandatarios.forEach(rolId => {
      this.notificacionesService.enviarByRolId(rolId,"Comanda Nueva!","Revisa tu panel de comandas para Tomarla");
    });    
        
  }


  public get(documentId: string) {
    return this.firestore.collection(this.getCollection()).doc(documentId).snapshotChanges();
  }

  public getAll() {   
    return this.firestore.collection(this.getCollection()).snapshotChanges();
  }


  public update(documentId: string, data: any) {
    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.getCollection()).doc(documentId).set({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });



  }

  public delete(comanda) {   
    console.log(this.getCollection())
    this.firestore.collection(this.getCollection()).doc(comanda.id).delete();
  }


  public rechazado(comanda) {    

    console.log(comanda)

    if(comanda.empleadoId)
      this.notificacionesService.enviarById(comanda.empleadoId,"La Comanda que generaste ha sido rechazada!","");
    
    if(comanda.clienteId)
      this.notificacionesService.enviarById(comanda.clienteId,"Tu pedido ha sido rechazado!","");

    this.firestore.collection(this.getCollection()).doc(comanda.id).delete();

  }


  public setComandaTomada(comanda:Comanda){   
    this.firestore.collection(this.getCollection()).doc(comanda.id).update({status: 1});
  }

  public setComandaVolver(comanda:Comanda){   
    this.firestore.collection(this.getCollection()).doc(comanda.id).update({status: 1});
  }

  public setComandaSuspendida(comanda:Comanda){   
    this.firestore.collection(this.getCollection()).doc(comanda.id).update({status: 0});
  }

  public setComandaLista(comanda){
    if(comanda.empleadoId)
      this.notificacionesService.enviarById(comanda.empleadoId,"La Comanda que generaste esta lista!","");
    
    if(comanda.clienteId)
      this.notificacionesService.enviarById(comanda.empleadoId,"Tu pedido esta listo!","");

    this.firestore.collection(this.getCollection()).doc(comanda.id).update({status: 2});
  }

  public setComandaCobrada(comandaId){
    console.log(comandaId)
    this.firestore.collection(this.getCollection()).doc(comandaId).update({status: 3});
    this.delete(comandaId);
    
  }

  public getComandasTomadasByEmpleado(empleadoId){
    return this.firestore.collection(this.getCollection(), ref => 
      ref.where('empleadoId','==',empleadoId).where('status','==',1)
       ).snapshotChanges();    
  }

  public getComandasListasByEmpleado(empleadoId){
    return this.firestore.collection(this.getCollection(), ref => 
      ref.where('empleadoId','==',empleadoId).where('status','==',2)
       ).snapshotChanges();    
  }

  

  


  

}
