import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { ComerciosService } from './comercios.service';

@Injectable({
  providedIn: 'root'
})
export class VariacionesStocksService extends BaseService {

  private comercioId = "";
  constructor(
    protected afs: AngularFirestore,
    private comerciosService:ComerciosService
    ) {     
      super(afs); 
      this.comerciosService.getSelectedCommerce().subscribe(data=>{
        if(data){
         this.comercioId = data.id
         }        
      })
  }


  setPathProducto(productoId){
    this.setPath('comercios/'+this.comercioId+'/productos/'+productoId+'/variacionesStock')  
  }

  getLast(productoId){
    this.setPathProducto(productoId)

    return this.afs.collection(this.path, ref => ref.limit(1))
            .snapshotChanges()
            .pipe(
                map(changes => {
                    return changes.map(a => {
                        const data:any = a.payload.doc.data();
                        data.id = a.payload.doc.id;
                        data.fromCache = a.payload.doc.metadata.fromCache;
                        if(data.createdAt instanceof String || Number){
                            data.createdAt = new Date(Number(data.createdAt))
                        }
                        else{
                            data.createdAt = data.createdAt.toDate();
                        }
                           
                        return data;
                    });
                })
            );     

  }

}
