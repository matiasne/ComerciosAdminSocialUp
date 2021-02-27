import { Injectable } from '@angular/core';
import { Pedido } from 'src/app/Models/pedido';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { BaseService } from './base.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PedidoService extends BaseService{

  private pedidoActual:Pedido = new Pedido();

  public actualPedidoSubject = new BehaviorSubject<Pedido>(this.pedidoActual);

  public pedidoCalificando:Pedido = new Pedido();

  constructor(
    protected afs: AngularFirestore,
  ) {     
    super(afs);      
  }

  setearPath(){
    let comercioId = localStorage.getItem('comercio_seleccionadoId');
    console.log(comercioId);
    if(comercioId)
      this.setPath('comercios/'+comercioId+'/pedidos')   
  }

  getByMesa(mesaId) {
    console.log('[BaseService] list: '+this.path);    

    return this.afs.collection(this.path, ref => ref.where('mesaId', '==', mesaId)).snapshotChanges()
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


  listCurso() {

  

    console.log('[BaseService] list: '+this.path);    

    return this.afs.collection(this.path, ref => ref.where('searchLogic', '==', '00')).snapshotChanges()
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

  listSuspendidos() {


    console.log('[BaseService] list: '+this.path);    

    return this.afs.collection(this.path, ref => ref.where('searchLogic', '==', '10')).snapshotChanges()
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

  listCobrados() {


    console.log('[BaseService] list: '+this.path);    

    return this.afs.collection(this.path, ref => ref.where('searchLogic', '==', '01')).snapshotChanges()
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
