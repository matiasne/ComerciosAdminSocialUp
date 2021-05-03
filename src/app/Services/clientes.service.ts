import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase';
import { map, subscribeOn } from 'rxjs/operators';
import * as firebase from 'firebase';
import { Cliente } from '../models/cliente';
import { KeywordService } from './keyword.service';
import { ComerciosService } from './comercios.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ClientesService extends BaseService {

  private collectionGroup:string;
  
  constructor(
    protected afs: AngularFirestore,
    private keywordService:KeywordService,
    private comerciosService:ComerciosService
    ) {     
      super(afs); 
      this.comerciosService.getSelectedCommerce().subscribe(data=>{
        // let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
        if(data){
         
         this.setPath('comercios/'+data.id+'/clientes')   
        }
        
      })
      this.collectionGroup ='/clientes';
  }


  public create(data:Cliente) {   

    this.keywordService.agregarKeywords(data, [data.nombre,data.email]);
   
    const param = JSON.parse(JSON.stringify(data));
    return this.afs.collection(this.path).doc(data.id).set({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()});
           
    
  }

  public get(documentId: string){
    return this.afs.collection(this.path).doc(documentId).snapshotChanges();
  }

  getByEmail(email){
    return this.afs.collection(this.path, ref =>  ref.where('email','==',email)).valueChanges();    
  }

  getByNombre(nombre){
    return this.afs.collection(this.path, ref =>  ref.where('nombre','==',nombre)).valueChanges();    
  }

  getRef(id){
    return this.afs.collection(this.path).doc(id).ref;
  }

  public getAll() {   
    return this.afs.collection(this.path).snapshotChanges();
  }
  
  public update(cliente:Cliente) {

    this.keywordService.agregarKeywords(cliente, [cliente.nombre,cliente.email]);


    console.log(cliente);
    const param = JSON.parse(JSON.stringify(cliente));
    return this.afs.collection(this.path).doc(cliente.id).set({...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public delete(data) {
    //Debo eliminar primero cada subscripción
    if(data.subscripciones){
      data.subscripciones.forEach(subscripcion => {
        this.afs.doc(subscripcion).delete();
      });
    }
    
    return this.afs.collection(this.path).doc(data.id).delete();    
  }

  public addCtaCorriente(clienteId,ctaCorrienteId){
    let param ={
      ctaId:ctaCorrienteId
    }
    this.afs.collection(this.path+'/'+clienteId+'/ctasCorrientes').doc(ctaCorrienteId).set(param)
  }

  public deleteCtaCorriente(clienteId,ctaCorrienteId){
    this.afs.collection(this.path+'/'+clienteId+'/ctasCorrientes').doc(ctaCorrienteId).delete();
  }

  public search(limit,orderBy,palabra,ultimo){      
    if(ultimo == ""){
      console.log("!!!!!! primero")
      console.log(palabra)     
      console.log(orderBy)
      return this.afs.collection(this.path, ref => 
        ref.where('keywords','array-contains',palabra)
            .orderBy(orderBy)
            .limit(limit)).snapshotChanges();
    }
    else{
      console.log(palabra)     
      console.log(orderBy)
      return this.afs.collection(this.path, ref => 
        ref.where('keywords','array-contains',palabra)
            .orderBy(orderBy)
            .startAfter(ultimo)
            .limit(limit)).snapshotChanges();    
    }    
  }  

  //Esto para ver todos los beneficios o cuestiones del cliente particular en todo el entorno
  public getAllClientesbyEmail(email) {  
    return this.afs.collectionGroup(this.collectionGroup, ref => ref.where('email', '==', email)).get(/*{ source: 'server' }*/)
    .pipe(
      map(actions => {
        const data = [];       
        actions.forEach(a => {
          const item = a.data() ;
          item.id = a.id;
          data.push(item);
        });
        return data;
      })
    )

  }

}
