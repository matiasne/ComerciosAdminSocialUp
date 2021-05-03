import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { snapshotChanges } from 'angularfire2/database';
import { Categoria } from '../models/categoria';
import { BaseService } from './base.service';
import { ComerciosService } from './comercios.service';

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

  public update(categoria:Categoria) {
    const param = JSON.parse(JSON.stringify(categoria));
    return this.afs.collection(this.path).doc(categoria.id).set(param);
  }

  public delete(categoria) {
    return this.afs.collection(this.path).doc(categoria.id).delete();
  }
}
