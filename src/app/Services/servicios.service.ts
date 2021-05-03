import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase';
import * as firebase from 'firebase';
import { PlanesService } from './planes.service';
import { Servicio } from '../models/servicio';
import { BaseService } from './base.service';
import { map } from 'rxjs/internal/operators/map';
import { SubscripcionesService } from './subscripciones.service';
import { ComerciosService } from './comercios.service';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService extends BaseService{

  private servicioId = "";
  private calendarioId = "";

  constructor(
    protected afs: AngularFirestore,
    private subscripcionesService:SubscripcionesService,
    private comerciosService:ComerciosService
    ) {     
      super(afs); 
      this.comerciosService.getSelectedCommerce().subscribe(data=>{
        // let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
        if(data){
          
          this.setPath('comercios/'+data.id+'/servicios')   
         }
        
      })
  }

  public async deleteS(id:string){
    //

    await this.subscripcionesService.getByServicioId(id).subscribe(snap =>{
      console.log(snap.docs);
      snap.forEach(n=>{
        console.log(n)
        console.log(n.data());
        this.subscripcionesService.delete(n.id);
      })
    })
    super.delete(id);

   // const docRef = this.getRef(id);
   // return docRef.delete();
  }

  

}
