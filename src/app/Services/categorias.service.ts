import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { snapshotChanges } from 'angularfire2/database';
import { Categoria } from '../models/categoria';
import { BaseService } from './base.service';
import { ComerciosService } from './comercios.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService extends BaseService { 
  
  constructor(
    protected afs: AngularFirestore,
    private comerciosService:ComerciosService
  ) {     
    super(afs); 
    this.comerciosService.getSelectedCommerce().subscribe(data=>{
      // let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
      if(data){
       
       this.setPath('comercios/'+data.id+'/categorias')   
      }
      
     })
  }

  public getByName(name){
    return this.afs.collection(this.path,ref=>ref.where("nombre","==",name)).snapshotChanges().pipe(
      map(changes => {
          return changes.map(a => {
              const data:any = a.payload.doc.data();
              data.id = a.payload.doc.id;
              data.fromCache = a.payload.doc.metadata.fromCache;
              return data;
          });
      })
    );   
  }
  
  public create(categoria:Categoria) {   
    const param = JSON.parse(JSON.stringify(categoria));
    return this.afs.collection(this.path).add(param);
  }

  public get(documentId: string) {
    return this.afs.collection(this.path).doc(documentId).snapshotChanges();
  }

  public getAll() {   
    return this.afs.collection(this.path).snapshotChanges();

  }

}
