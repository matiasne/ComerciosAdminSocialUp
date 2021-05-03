import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { ClientesService } from './clientes.service';
import { ServiciosService } from './servicios.service';
import * as firebase from 'firebase';
import { Pagare } from '../models/pagare';
import { BaseService } from './base.service';
import { ComerciosService } from './comercios.service';


@Injectable({
  providedIn: 'root'
})
export class PagaresService extends BaseService{

  private subsId = "";
  private comercioId=""
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


  setSubsId(id){
    this.subsId = id;
    console.log("comercios/"+this.comercioId+"/subscripciones/"+this.subsId+"/pagares")
    this.setPath("comercios/"+this.comercioId+"/subscripciones/"+this.subsId+"/pagares");
  }
}
