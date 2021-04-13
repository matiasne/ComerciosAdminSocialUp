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

  getMovimientoCtaCorriente(ctaCorrienteId,movId,fechaDesde){
    var comercioId = localStorage.getItem('comercio_seleccionadoId');
    return this.firestore.collection('comercios/'+comercioId+'/ctascorrientes/'+ctaCorrienteId+'/movimientos',ref=>ref.where('createdAt', '>=', fechaDesde).orderBy('createdAt',"desc")).doc(movId).snapshotChanges();
  }

 
  public getMovimientosCaja(cajaId,fechaDesde){
    var comercioId = localStorage.getItem('comercio_seleccionadoId');
    return this.firestore.collection('comercios/'+comercioId+'/cajas/'+cajaId+'/movimientos',ref=>ref.where('createdAt', '>=', fechaDesde).orderBy('createdAt',"desc")).snapshotChanges();
  }


  public createMovimientoCaja(caja:Caja,mov:MovimientoCaja) {

    var comercioId = localStorage.getItem('comercio_seleccionadoId');

    //this.firestore.firestore.collection('comercios/'+caja.comercioId+'/cajas').doc(caja.id).get().then(doc=>{
      
      //let caja:Caja = new Caja();
      //caja.asignarValores(doc.data())
      //caja.id = doc.id;
      mov.cajaId = caja.id
      mov.fotoCaja = caja;

      if(mov.metodoPago == "efectivo"){
        caja.totalEfectivo = Number(caja.totalEfectivo)+ Number(mov.monto);
      }
      if(mov.metodoPago == "credito"){
        caja.totalCredito = Number(caja.totalCredito)+ Number(mov.monto);
      }
      if(mov.metodoPago == "debito"){
        caja.totalDebito = Number(caja.totalDebito) + Number(mov.monto);
      }
     
      

      console.log(mov)
    
      const param = JSON.parse(JSON.stringify(mov));

      if(mov.cajaId != ""){
        const param1 = JSON.parse(JSON.stringify(caja));
        this.cajasService.update(param1);
        this.firestore.collection('comercios/'+comercioId+'/cajas/'+mov.cajaId+'/movimientos').doc(mov.id).set(
          {...param,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })  
      }
      else{
        console.log('comercios/'+comercioId+'/movimientos')
        this.firestore.collection('comercios/'+comercioId+'/movimientos').doc(mov.id).set(
          {...param,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })  
      }
     

    //})
     

    
  }

  eliminarMovimientoCaja(caja:Caja,data:MovimientoCaja){  

    var comercioId = localStorage.getItem('comercio_seleccionadoId');   

    this.firestore.collection('comercios/'+comercioId+'/cajas/'+data.cajaId+'/movimientos').doc(data.id).delete();
      
    this.restarTotalCaja(data.cajaId,data.metodoPago,data.monto);

    if(data.depositoId != ""){  
      console.log("Eliminando Deposito también "+data.ctaCorrienteId+" "+data.depositoId)
      this.restarTotalCtaCorriente(data.ctaCorrienteId,data.monto);       
      this.firestore.collection('comercios/'+comercioId+'/ctascorrientes/'+data.ctaCorrienteId+'/movimientos').doc(data.depositoId).delete();
    }

    if(data.extraccionId != ""){  
      console.log("Eliminando Extracción también "+data.ctaCorrienteId+" "+data.extraccionId)
      this.restarTotalCtaCorriente(data.ctaCorrienteId,data.monto);       
      this.firestore.collection('comercios/'+comercioId+'/ctascorrientes/'+data.ctaCorrienteId+'/movimientos').doc(data.extraccionId).delete();
    }

  }

  
 
  public restarTotalCaja(cajaId,metodo,monto){       
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
      
    const sfDocRef = this.firestore.firestore.collection('comercios/'+comercio_seleccionadoId+'/cajas').doc(cajaId);
    
      this.firestore.firestore.runTransaction(transaction => 
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
      let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
      return this.firestore.collection('comercios/'+comercio_seleccionadoId+'/ctascorrientes/'+ctaCorrienteId+'/movimientos/', ref=>ref.orderBy('createdAt',"desc").limit(10)).snapshotChanges();
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
            
    
          }))
    }
  
    crearMovimientoCtaCorriente(data:MovimientoCtaCorriente){
      let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');

      console.log(data.ctaCorrienteId)
     
      this.firestore.firestore.collection('comercios/'+comercio_seleccionadoId+'/ctascorrientes').doc(data.ctaCorrienteId).get().then(doc=>{
      
       
        let cta:CtaCorriente = new CtaCorriente("","");
        cta.asignarValores(doc.data())
        cta.id = doc.id;  
        data.fotoCtaCorriente = doc.data();
        cta.montoTotal = Number(cta.montoTotal) + Number(data.monto);  
        
        const param1 = JSON.parse(JSON.stringify(cta));
        this.ctaCorrienteService.update(param1).then(data=>{
          
        });

        
        const param2 = JSON.parse(JSON.stringify(data));
        this.firestore.collection('comercios/'+comercio_seleccionadoId+'/ctascorrientes/'+data.ctaCorrienteId+'/movimientos').doc(data.id).set({...param2,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
  
      })
  
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

