import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { Producto } from '../models/producto';
import { variacionStock } from '../models/variacionStock';
import { BaseService } from './base.service';
import { ComerciosService } from './comercios.service';
import { KeywordService } from './keyword.service';
import { VariacionesStocksService } from './variaciones-stocks.service';

@Injectable({
  providedIn: 'root'
})
export class ProductosService extends BaseService {

  private woocommerceSyncPath =""
  constructor(
    protected afs: AngularFirestore,
    private comerciosService:ComerciosService,
    private variacionesStockService:VariacionesStocksService
  ) {
    super(afs);   
    this.comerciosService.getSelectedCommerce().subscribe(data=>{
     // let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
      if(data){      
        this.setPath('comercios/'+data.id+'/productos') 
      }     
    })
      
  }

  getWoocommerceValue(productoId){
    this.woocommerceSyncPath = this.path+'/'+productoId+'/woocommerceSincData'
    return this.afs.collection(this.woocommerceSyncPath).doc("1").get()
    .pipe(
        map(doc => {
            if (doc.exists) {
        /* workaround until spread works with generic types */
                const data = doc.data() as any;
                const id = doc.id;
                data.fromCache = doc.metadata.fromCache;
                return { id, ...data };
            }
        })
    ); 
  }

  updateWoocommerceValues(productoId,values){
    this.woocommerceSyncPath = this.path+'/'+productoId+'/woocommerceSincData'
    this.afs.collection(this.woocommerceSyncPath).doc("1").set(values).then(data=>{
      console.log("Actualizados los valores de woocommerce")
    })
  }

  
  deleteWoocommerceValues(id){
    this.woocommerceSyncPath = this.path+'/'+id+'/woocommerceSincData'
    this.afs.collection(this.woocommerceSyncPath).doc("1").delete().then(data=>{
      console.log("Actualizados los valores de woocommerce")
    })
  }


  getCollection(){
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
    return 'comercios/'+comercio_seleccionadoId+'/productos';
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

  public updateStock(delta,productoId){ 

    var sfDocRef = this.afs.firestore.collection(this.path).doc(productoId);

    return this.afs.firestore.runTransaction((transaction) => {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(sfDocRef).then((sfDoc) => {
          if (!sfDoc.exists) {
              throw "Document does not exist!";
          }
          
          var newStock = sfDoc.data().stock + delta;
          transaction.update(sfDocRef, { stock: newStock });

          let vStock:variacionStock = new variacionStock();
          vStock.productoId = productoId; 
          vStock.stock = sfDoc.data().stock;
          this.variacionesStockService.setPathProducto(productoId);
          this.variacionesStockService.add(vStock).then(resp =>{           

          }); 

      });
  }).then(() => {
      
          
          
    
  }).catch((error) => {
      console.log("Transaction failed: ", error);
  });

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
