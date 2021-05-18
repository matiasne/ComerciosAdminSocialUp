import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { CtaCorrientesService } from './cta-corrientes.service';
import { CajasService } from './cajas.service';
import { MovimientoCaja } from '../models/movimientoCaja';
import * as firebase from 'firebase';
import { MovimientoCtaCorriente } from '../models/movimientoCtaCorriente';
import { Mock } from 'protractor/built/driverProviders';
import { Caja } from '../models/caja';
import { CtaCorriente } from '../models/ctacorriente';
import { BaseService } from './base.service';
import { ComerciosService } from './comercios.service';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService extends BaseService {

  private comercioId = "";
  constructor(
    protected afs: AngularFirestore,
    private ctaCorrienteService:CtaCorrientesService,
    private cajasService:CajasService,
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


  setearPath(cajaId){
      this.setPath('comercios/'+this.comercioId+'/cajas/'+cajaId+'/movimientos')   
  }

  getMovimientoCaja(cajaId,movId){
    return this.afs.collection('comercios/'+this.comercioId+'/cajas/'+cajaId+'/movimientos').doc(movId).snapshotChanges();
  }

  getMovimientoCtaCorriente(ctaCorrienteId,movId,fechaDesde){
    return this.afs.collection('comercios/'+this.comercioId+'/ctascorrientes/'+ctaCorrienteId+'/movimientos',ref=>ref.where('createdAt', '>=', fechaDesde).orderBy('createdAt',"desc")).doc(movId).snapshotChanges();
  }

 
  public getMovimientosCaja(cajaId,fechaDesde){
    return this.afs.collection('comercios/'+this.comercioId+'/cajas/'+cajaId+'/movimientos',ref=>ref.where('createdAt', '>=', fechaDesde).orderBy('createdAt',"desc")).snapshotChanges();
  }


  

  eliminarMovimientoCaja(caja:Caja,data:MovimientoCaja){  

    this.afs.collection('comercios/'+this.comercioId+'/cajas/'+data.cajaId+'/movimientos').doc(data.id).delete();
      
    this.restarTotalCaja(data.cajaId,data.metodoPago,data.monto);

    if(data.depositoId != ""){  
      console.log("Eliminando Deposito también "+data.ctaCorrienteId+" "+data.depositoId)
      this.restarTotalCtaCorriente(data.ctaCorrienteId,data.monto);       
      this.afs.collection('comercios/'+this.comercioId+'/ctascorrientes/'+data.ctaCorrienteId+'/movimientos').doc(data.depositoId).delete();
    }

    if(data.extraccionId != ""){  
      console.log("Eliminando Extracción también "+data.ctaCorrienteId+" "+data.extraccionId)
      this.restarTotalCtaCorriente(data.ctaCorrienteId,data.monto);       
      this.afs.collection('comercios/'+this.comercioId+'/ctascorrientes/'+data.ctaCorrienteId+'/movimientos').doc(data.extraccionId).delete();
    }

  }

  
 
  public restarTotalCaja(cajaId,metodo,monto){       
      
    const sfDocRef = this.afs.firestore.collection('comercios/'+this.comercioId+'/cajas').doc(cajaId);
    
      this.afs.firestore.runTransaction(transaction => 
        // This code may get re-run multiple times if there are conflicts.
        transaction.get(sfDocRef)
        .then(sfDoc => {
          // const newPopulation = sfDoc.data().population + 1;
          if(metodo == "efectivo"){
            transaction.update(sfDocRef, { totalEfectivo: sfDoc.data().totalEfectivo - monto });
          }
          if(metodo == "debito"){
            transaction.update(sfDocRef, { totalDebito: sfDoc.data().totalDebito - monto });
          }
          if(metodo == "credito"){
            transaction.update(sfDocRef, { totalCredito: sfDoc.data().totalCredito - monto });
          }
  
          if(metodo =="ctaCorriente"){
            transaction.update(sfDocRef, { totalCtaCorriente: sfDoc.data().totalCtaCorriente - monto });
          }
  
        }))
    }

    public getMovimientosCtaCorriente(ctaCorrienteId){
      return this.afs.collection('comercios/'+this.comercioId+'/ctascorrientes/'+ctaCorrienteId+'/movimientos/', ref=>ref.orderBy('createdAt',"desc").limit(10)).snapshotChanges();
    }  
    
  
    public restarTotalCtaCorriente(ctaCorrienteId,monto){
        
        const sfDocRef = this.afs.firestore.collection('comercios/'+this.comercioId+'/ctascorrientes').doc(ctaCorrienteId);
      
        this.afs.firestore.runTransaction(transaction => 
          // This code may get re-run multiple times if there are conflicts.
          transaction.get(sfDocRef)
          .then(sfDoc => {
            // const newPopulation = sfDoc.data().population + 1;
           
            transaction.update(sfDocRef, { montoTotal: sfDoc.data().montoTotal - monto });
            
    
          }))
    }
  
    crearMovimientoCtaCorriente(data:MovimientoCtaCorriente){

      console.log(data.ctaCorrienteId)
     
      this.afs.firestore.collection('comercios/'+this.comercioId+'/ctascorrientes').doc(data.ctaCorrienteId).get().then(doc=>{
      
       
        let cta:CtaCorriente = new CtaCorriente("","");
        cta.asignarValores(doc.data())
        cta.id = doc.id;  
        data.fotoCtaCorriente = doc.data();
        cta.montoTotal = Number(cta.montoTotal) + Number(data.monto);  
        
        const param1 = JSON.parse(JSON.stringify(cta));
        this.ctaCorrienteService.update(param1).then(data=>{
          
        });

        
        const param2 = JSON.parse(JSON.stringify(data));
        this.afs.collection('comercios/'+this.comercioId+'/ctascorrientes/'+data.ctaCorrienteId+'/movimientos').doc(data.id).set({...param2,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
  
      })
  
    }
  
    eliminarMovimientoCtaCorriente(data:MovimientoCtaCorriente){  
  

      this.restarTotalCtaCorriente(data.ctaCorrienteId,data.monto);
      console.log(data)
      
      if(data.pagoId != ""){
        console.log("Eliminando Pago también"+data.cajaId+" "+data.pagoId);

       /* this.cajasService.get(this.comercioId,data.cajaId).subscribe(snap=>{
          var caja:Caja = new Caja();
          caja.asignarValores(snap.payload.data())
          caja.id = snap.payload.id;*/
          this.restarTotalCaja(data.cajaId,data.metodoPago,data.monto);
          this.afs.collection('comercios/'+this.comercioId+'/cajas/'+data.cajaId+'/movimientos').doc(data.pagoId).delete();
        //})        
      }
  
      const param = JSON.parse(JSON.stringify(data));
      this.afs.collection('comercios/'+this.comercioId+'/ctascorrientes/'+data.ctaCorrienteId+'/movimientos').doc(data.id).delete();
    } 
    

  }

