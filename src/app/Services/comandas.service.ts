import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { CarritoService } from './global/carrito.service';
import { AuthenticationService } from './authentication.service';
import { VentasService } from './ventas.service';
import { Subscribable, Subscription } from 'rxjs';
import { NotificacionesService } from './notificaciones.service';
import { ComerciosService } from './comercios.service';
import { Comanda } from '../models/comanda';

@Injectable({
  providedIn: 'root'
})
export class ComandasService {

  private collection:string;
  private carritoSubs:Subscription;

  constructor(
    private firestore: AngularFirestore,
    private authService:AuthenticationService,
    private ventasService:VentasService,
    private notificacionesService:NotificacionesService,
    private comerciosService:ComerciosService
  ) {
    
  }

  getCollection(){
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    return 'comercios/'+comercio_seleccionadoId+'/comandas';
  } 

  public create(carrito) {
   
  /*  this.comerciosService.getSelectedCommerce().subscribe(data=>{
      let comercio:any = data;
      console.log(comercio)
      comercio.rolComandatarios.forEach(comandatarioId => {
        this.notificacionesService.enviarByRolId(comandatarioId,"Comandas","Nueva Comanda Generada!!!");
      });      
    }); 

    
        */
    var comanda = new Comanda(this.authService.getUID(),this.authService.getActualUser().displayName,this.authService.getActualUser().email);
    comanda.clienteId = "";
    comanda.clienteNombre = "";
    comanda.carrito = JSON.stringify(carrito);
        

    if(carrito.cliente){
      comanda.clienteId = carrito.cliente.id;
      comanda.clienteNombre = carrito.cliente.nombre;

   //   this.notificacionesService.enviarById(carrito.cliente.id,"Su pedido ha sido comandado!",new Date());
    }

    console.log(comanda);

    this.firestore.collection(this.getCollection()).add( {...comanda,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
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

  public delete(documentId: string) {
    return this.firestore.collection(this.getCollection()).doc(documentId).delete();
  }

  public setComandaTomada(comanda:Comanda){   
    this.firestore.collection(this.getCollection()).doc(comanda.id).update({status: 1});
  }

  public setComandaLista(comanda){

    this.notificacionesService.enviarById(comanda.empleadoId,"Comanda Lista!",new Date());

    this.firestore.collection(this.getCollection()).doc(comanda.id).update({status: 2});
  }

  public setComandaCobrada(comandaId){
    //Acá se borra y se crea la venta
   
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
