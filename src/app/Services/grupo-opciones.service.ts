import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { GrupoOpciones } from '../models/grupoOpciones';
import { BaseService } from './base.service';
import { ComerciosService } from './comercios.service';

@Injectable({
  providedIn: 'root'
})
export class GrupoOpcionesService extends BaseService { 

  constructor(
    protected afs: AngularFirestore,
    private comerciosService:ComerciosService
    ) {     
      super(afs); 
      this.comerciosService.getSelectedCommerce().subscribe(data=>{
        // let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId'); 
        if(data){
          
          this.setPath('comercios/'+data.id+'/grupoOpciones')   
         }
        
      })
  }


}
