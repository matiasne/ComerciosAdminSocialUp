import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { ComerciosService } from './comercios.service';

@Injectable({
  providedIn: 'root'
})
export class PedidosWoocommerceService extends BaseService {


  constructor(
    protected afs: AngularFirestore,
    private comerciosService:ComerciosService
    ) {     
      super(afs); 
      this.comerciosService.getSelectedCommerce().subscribe(data=>{
        if(data){
          
          this.setPath('comercios/'+data.id+'/pedidosWoocommerce')   
         }        
      })
  }

  
  listFechaDesde(fechaFrom,fechaTo){
    
    console.log(fechaFrom); 

    console.log(fechaTo); 

    return this.afs.collection(this.path, ref => ref.where('date_created', '>=', fechaFrom).where('date_created', '<=', fechaTo).orderBy('date_created',"desc").limit(50)).snapshotChanges()
        .pipe(
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

}
