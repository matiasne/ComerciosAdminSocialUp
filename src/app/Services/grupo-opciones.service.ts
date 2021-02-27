import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { GrupoOpciones } from '../models/grupoOpciones';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class GrupoOpcionesService extends BaseService { 

  constructor(
    protected afs: AngularFirestore,
  ) {
    super(afs);      
  }  

  setearPath(){
    let comercioId = localStorage.getItem('comercio_seleccionadoId');
    console.log(comercioId);
    if(comercioId)
      this.setPath('comercios/'+comercioId+'/grupoOpciones')   
  }

}
