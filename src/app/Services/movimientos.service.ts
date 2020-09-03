import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { CtaCorrientesService } from './cta-corrientes.service';
import { CajasService } from './cajas.service';
import { MovimientoCaja } from '../models/movimientoCaja';
import * as firebase from 'firebase';
import { MovimientoCtaCorriente } from '../models/movimientoCtaCorriente';
import { Mock } from 'protractor/built/driverProviders';
import { Caja } from '../models/caja';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {

  constructor(
    private firestore: AngularFirestore,
    private ctaCorrienteService:CtaCorrientesService,
    private cajasService:CajasService
  ) { 


  }

  getMovimientoCaja(cajaId,movId){
    var comercioId = localStorage.getItem('comercio_seleccionadoId');
    return this.firestore.collection('comercios/'+comercioId+'/cajas/'+cajaId+'/movimientos').doc(movId).snapshotChanges();
  }

  getMovimientoCtaCorriente(ctaCorrienteId,movId){
    var comercioId = localStorage.getItem('comercio_seleccionadoId');
    return this.firestore.collection('comercios/'+comercioId+'/ctascorrientes/'+ctaCorrienteId+'/movimientos').doc(movId).snapshotChanges();
  }

 
  public getMovimientosCaja(cajaId){
    var comercioId = localStorage.getItem('comercio_seleccionadoId');
    return this.firestore.collection('comercios/'+comercioId+'/cajas/'+cajaId+'/movimientos',ref=>ref.orderBy('createdAt')).snapshotChanges();
  }


  public createMovimientoCaja(caja:Caja,data:MovimientoCaja) {

    var comercioId = localStorage.getItem('comercio_seleccionadoId');

     

    console.log(data)
    
    const param = JSON.parse(JSON.stringify(data));
    this.firestore.collection('comercios/'+comercioId+'/cajas/'+data.cajaId+'/movimientos').doc(data.id).set(
      {...param,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }).then(resp=>{
      this.sumarTotalCaja(caja,data.metodoPago,data.monto);  
    });  
  }

  eliminarMovimientoCaja(caja:Caja,data:MovimientoCaja){  

    var comercioId = localStorage.getItem('comercio_seleccionadoId');

   

    this.firestore.collection('comercios/'+comercioId+'/cajas/'+data.cajaId+'/movimientos').doc(data.id).delete().then(resp=>{
      
      this.restarTotalCaja(data.cajaId,data.metodoPago,data.monto);

      if(data.depositoId != ""){  
        console.log("Eliminando Deposito también "+data.ctaCorrienteId+" "+data.depositoId)
        this.restarTotalCtaCorriente(data.ctaCorrienteId,data.monto);       
        this.firestore.collection('comercios/'+comercioId+'/ctascorrientes/'+data.ctaCorrienteId+'/movimientos').doc(data.depositoId).delete();
      }
    });
  }

  public sumarTotalCaja(caja:Caja,metodo,monto){

    
    const sfDocRef = this.firestore.firestore.collection('comercios/'+caja.comercioId+'/cajas').doc(caja.id);
  
    this.firestore.firestore.runTransaction(transaction => 
      // This code may get re-run multiple times if there are conflicts.
      transaction.get(sfDocRef)
      .then(sfDoc => {
        // const newPopulation = sfDoc.data().population + 1;
        
        if(metodo == "Efectivo"){
          console.log(monto)
          transaction.update(sfDocRef, { totalEfectivo: sfDoc.data().totalEfectivo + monto });
        }
        if(metodo == "Débito"){
          transaction.update(sfDocRef, { totalDebito: sfDoc.data().totalDebito + monto });
        }
        if(metodo == "Crédito"){
          transaction.update(sfDocRef, { totalCredito: sfDoc.data().totalCredito + monto });
        }

        if(metodo =="Cta. Corriente"){
          transaction.update(sfDocRef, { totalCtaCorriente: sfDoc.data().totalCtaCorriente + monto });
        }

      })).then(() => console.log("Transaction successfully committed!"))
    .catch(error => console.log("Transaction failed: ", error));
  }
 
  public restarTotalCaja(cajaId,metodo,monto){       
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
      
    const sfDocRef = this.firestore.firestore.collection('comercios/'+comercio_seleccionadoId+'/cajas').doc(cajaId);
    
      this.firestore.firestore.runTransaction(transaction => 
        // This code may get re-run multiple times if there are conflicts.
        transaction.get(sfDocRef)
        .then(sfDoc => {
          // const newPopulation = sfDoc.data().population + 1;
          if(metodo == "Efectivo"){
            transaction.update(sfDocRef, { totalEfectivo: sfDoc.data().totalEfectivo - monto });
          }
          if(metodo == "Débito"){
            transaction.update(sfDocRef, { totalDebito: sfDoc.data().totalDebito - monto });
          }
          if(metodo == "Crédito"){
            transaction.update(sfDocRef, { totalCredito: sfDoc.data().totalCredito - monto });
          }
  
          if(metodo =="Cta. Corriente"){
            transaction.update(sfDocRef, { totalCtaCorriente: sfDoc.data().totalCtaCorriente - monto });
          }
  
        })).then(() => console.log("Transaction successfully committed!"))
      .catch(error => console.log("Transaction failed: ", error));
    }

    public getMovimientosCtaCorriente(ctaCorrienteId){
      let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
      return this.firestore.collection('comercios/'+comercio_seleccionadoId+'/ctascorrientes/'+ctaCorrienteId+'/movimientos/', ref=>ref.orderBy('createdAt','asc')).snapshotChanges();
    }  
    
    public sumarTotalCtaCorriente(ctaCorrienteId,monto){
  
      let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
      
      const sfDocRef = this.firestore.firestore.collection('comercios/'+comercio_seleccionadoId+'/ctascorrientes').doc(ctaCorrienteId);
    
      this.firestore.firestore.runTransaction(transaction => 
        // This code may get re-run multiple times if there are conflicts.
        transaction.get(sfDocRef)
        .then(sfDoc => {
          // const newPopulation = sfDoc.data().population + 1;
         
          transaction.update(sfDocRef, { montoTotal: sfDoc.data().montoTotal + monto });
          
  
        })).then(() => console.log("Transaction successfully committed!"))
      .catch(error => console.log("Transaction failed: ", error));
    }
  
    public restarTotalCtaCorriente(ctaCorrienteId,monto){
        let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
        
        const sfDocRef = this.firestore.firestore.collection('comercios/'+comercio_seleccionadoId+'/ctascorrientes').doc(ctaCorrienteId);
      
        this.firestore.firestore.runTransaction(transaction => 
          // This code may get re-run multiple times if there are conflicts.
          transaction.get(sfDocRef)
          .then(sfDoc => {
            // const newPopulation = sfDoc.data().population + 1;
           
            transaction.update(sfDocRef, { montoTotal: sfDoc.data().montoTotal - monto });
            
    
          })).then(() => console.log("Transaction successfully committed!"))
        .catch(error => console.log("Transaction failed: ", error));
    }
  
    crearMovimientoCtaCorriente(data:MovimientoCtaCorriente){
      let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');

      this.sumarTotalCtaCorriente(data.ctaCorrienteId,data.monto);
  
      const param = JSON.parse(JSON.stringify(data));
      this.firestore.collection('comercios/'+comercio_seleccionadoId+'/ctascorrientes/'+data.ctaCorrienteId+'/movimientos').doc(data.id).set({...param,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  
    eliminarMovimientoCtaCorriente(data:MovimientoCtaCorriente){  
  
      let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');

      this.restarTotalCtaCorriente(data.ctaCorrienteId,data.monto);
      console.log(data)
      
      if(data.pagoId != ""){
        console.log("Eliminando Pago también"+data.cajaId+" "+data.pagoId);

       /* this.cajasService.get(comercio_seleccionadoId,data.cajaId).subscribe(snap=>{
          var caja:Caja = new Caja();
          caja.asignarValores(snap.payload.data())
          caja.id = snap.payload.id;*/
          this.restarTotalCaja(data.cajaId,data.metodoPago,data.monto);
          this.firestore.collection('comercios/'+comercio_seleccionadoId+'/cajas/'+data.cajaId+'/movimientos').doc(data.pagoId).delete();
        //})        
      }
  
      const param = JSON.parse(JSON.stringify(data));
      this.firestore.collection('comercios/'+comercio_seleccionadoId+'/ctascorrientes/'+data.ctaCorrienteId+'/movimientos').doc(data.id).delete();
    }
    

  }

