import { Injectable } from '@angular/core';
import { Pedido } from 'src/app/models/pedido';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { BaseService } from './base.service';
import { map } from 'rxjs/operators';
import { EnumTipoDescuento } from '../models/descuento';
import { EnumTipoRecargo } from '../models/recargo';
import { ComerciosService } from './comercios.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoService extends BaseService{

  private pedidoActual:Pedido = new Pedido();

  public actualPedidoSubject = new BehaviorSubject<Pedido>(this.pedidoActual);

  public pedidoCalificando:Pedido = new Pedido();

  constructor(
    protected afs: AngularFirestore,
    private comerciosService:ComerciosService
    ) {     
      super(afs); 
      this.comerciosService.getSelectedCommerce().subscribe(data=>{
        if(data){
          
          this.setPath('comercios/'+data.id+'/pedidos')   
         }        
      })
  }


  getByMesa(mesaId) {
        

    return this.afs.collection(this.path, ref => ref.where('mesaId', '==', mesaId).limit(40)).snapshotChanges()
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



  listFechaDesde(fechaFrom,fechaTo){
    
    console.log(fechaFrom); 

    console.log(fechaTo); 

    return this.afs.collection(this.path, ref => ref.where('createdAt', '>=', fechaFrom).where('createdAt', '<=', fechaTo).orderBy('createdAt',"desc").limit(50)).snapshotChanges()
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

  public getTotal(pedido:Pedido){
 
   
    let total = 0;

    pedido.productos.forEach(prod =>{
      total += prod.precioTotal
    })    

    let totalPorcentaje = 0;
    pedido.descuentos.forEach(descuento =>{
      if(descuento.tipo == EnumTipoDescuento.porcentaje){
        totalPorcentaje += Number(descuento.monto)
      }
    })

    let descontar = (total*totalPorcentaje)/100;

    total = total-descontar;

    let totalMonto = 0;
    pedido.descuentos.forEach(descuento =>{
      if(descuento.tipo == EnumTipoDescuento.monto){
        totalMonto += Number(descuento.monto)
      }
    })

    total = total-totalMonto;
    totalPorcentaje = 0;
    pedido.recargos.forEach(recargo =>{
      if(recargo.tipo == EnumTipoRecargo.porcentaje){
        totalPorcentaje += Number(recargo.monto)
      }
    })

    let sumar = (total*totalPorcentaje)/100;

    total = total+sumar;

    totalMonto = 0;
    pedido.recargos.forEach(recargo =>{
      if(recargo.tipo == EnumTipoRecargo.monto){
        totalMonto += Number(recargo.monto)
      }
    })

    total = total+totalMonto;
    return total;
  }
  

  
}
