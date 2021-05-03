import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { ClientesService } from './clientes.service';
import { ServiciosService } from './servicios.service';
import * as firebase from 'firebase';
import { BaseService } from './base.service';
import { map } from 'rxjs/operators';
import { ComerciosService } from './comercios.service';

@Injectable({
  providedIn: 'root'
})
export class SubscripcionesService extends BaseService{

  constructor(
    protected afs: AngularFirestore,
    private firestore: AngularFirestore,
    private comerciosService:ComerciosService
    ) {     
      super(afs); 
      this.comerciosService.getSelectedCommerce().subscribe(data=>{
        if(data){
          
          this.setPath('comercios/'+data.id+'/subscripciones')   
         }        
      })
  }

  getByServicioId(id){
    return this.firestore.collection(this.path, ref => ref.where('servicioId', '==', id)).get(/*{ source: 'server' }*/)
    
    
  }

  


}
