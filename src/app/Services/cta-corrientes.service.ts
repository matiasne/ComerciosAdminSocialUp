import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { CtaCorriente } from '../models/ctacorriente';
import { ClientesService } from './clientes.service';
import { MovimientoCtaCorriente } from '../models/movimientoCtaCorriente';
import { MovimientoCaja } from '../models/movimientoCaja';
import { CajasService } from './cajas.service';
import { BaseService } from './base.service';
import { ComerciosService } from './comercios.service';

@Injectable({
  providedIn: 'root'
})
export class CtaCorrientesService extends BaseService {

  
  constructor(
    private firestore: AngularFirestore,
    private clientesService:ClientesService,
    private comerciosService:ComerciosService
    ) {     
      super(firestore); 
      this.comerciosService.getSelectedCommerce().subscribe(data=>{
        // let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
        if(data){
          
          this.setPath('comercios/'+data.id+'/ctascorrientes')   
         }
        
      })
  }

  
  public create(data:CtaCorriente) {   

    data.id = this.firestore.createId();

    const param = JSON.parse(JSON.stringify(data));
    this.firestore.collection(this.path).add({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });  
    
    data.coTitularesId.forEach(element => {
      this.clientesService.addCtaCorriente(element,data.id);
    });
    
  }

  public get(documentId: string) {
    return this.firestore.collection(this.path).doc(documentId).snapshotChanges();
  }

  public getByComercioCliente(cliente){
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    return this.firestore.collection(this.path, ref => 
        ref.where('coTitularesId','array-contains',cliente.id)).snapshotChanges();
  }


  public getByCliente(clienteId){
    return this.firestore.collection(this.path, ref => 
        ref.where('coTitularesId','array-contains',clienteId)).snapshotChanges();
  }


  public getByClienteId(id) {   
    return this.firestore.collection(this.path, ref =>ref.where(id,"==","clienteId")).snapshotChanges();
  } 
 
 

}
