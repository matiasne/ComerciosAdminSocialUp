import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { Producto } from '../models/producto';
import { BaseService } from './base.service';
import { ComerciosService } from './comercios.service';
import { KeywordService } from './keyword.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService extends BaseService {

  constructor(
    protected afs: AngularFirestore,
    private comerciosService:ComerciosService
  ) {
    super(afs);   
    this.comerciosService.getSelectedCommerce().subscribe(data=>{
     // let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
     if(data){
      
      this.setPath('comercios/'+data.id+'/productos') 
     }
     
    })
      
  }


  getCollection(){
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    return 'comercios/'+comercio_seleccionadoId+'/productos';
  }

  getByWocoommerceId(id){
    return this.afs.collection(this.path, ref =>  ref.where('woocommerce.id','==',id)).get().toPromise()
  }

  

  /*public create(data:Producto) {

    this.keywordService.agregarKeywords(data, [data.nombre,...data.categorias]);

    let time = new Date();
      const param = JSON.parse(JSON.stringify(data));
      this.firestore.doc(this.getCollection()+"/"+data.id).set( {...param,
        createdAt: time,
      });   
     
  }*/
/*
  public getAll() {   
    return this.firestore.collection(this.getCollection(),ref=> ref.orderBy('nombre')).snapshotChanges();
  }*/

 /* public update(data) {

    console.log(data)

    let time = new Date();

    const param = JSON.parse(JSON.stringify(data));
    return this.firestore.collection(this.getCollection()).doc(data.id).set({...param,
      updatedAt: time,
    },{merge:true});
  }*/ 


}
