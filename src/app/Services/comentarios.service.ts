import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { BaseService } from './base.service';
import { ComerciosService } from './comercios.service';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService extends BaseService{

  private comercioId = "";
  constructor(
    protected afs: AngularFirestore,
    private comerciosService:ComerciosService
    ) {     
      super(afs); 
      this.comerciosService.getSelectedCommerce().subscribe(data=>{
        // let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
        if(data){
         this.comercioId = data.id
        }
        
      })
  }
  setearPath(tipo,id){
      this.setPath('comercios/'+this.comercioId +'/'+tipo+'/'+id+'/comentario');   
  }

}
