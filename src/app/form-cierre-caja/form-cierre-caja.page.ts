import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../Services/authentication.service';
import { CajasService } from '../Services/cajas.service';
import { Caja } from '../models/caja';
import { MovimientoCaja } from '../models/movimientoCaja';
import { MovimientosService } from '../Services/movimientos.service';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-form-cierre-caja',
  templateUrl: './form-cierre-caja.page.html',
  styleUrls: ['./form-cierre-caja.page.scss'],
})
export class FormCierreCajaPage implements OnInit {

  public datosForm: FormGroup;  
  public fecha = new Date();
  public cajaId = "";
  submitted = false;
  public totalActual=0;
  public caja:Caja;

  public extraccionEfectivo = 0;
  public extraccionDebito = 0;
  public extraccionCredito = 0;
  
  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private authenticationService:AuthenticationService,
    private cajasServices:CajasService,
    private movimientosService:MovimientosService,
    private firestore: AngularFirestore,
  ) { 
    this.fecha = new Date();
    this.caja = new Caja();

    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    this.cajasServices.get(comercio_seleccionadoId,this.route.snapshot.params.cajaId).subscribe(snap =>{
      this.caja.asignarValores(snap.payload.data());
      this.caja.id = snap.payload.id;
    })

    
  }

  ngOnInit() {

    //Cada caja puede extraer el efectivo y dejar el debito o el credito o retirar solo esos tickets
  }

  get f() { return this.datosForm.controls; }

  cerrar(){
    this.submitted = true;

    console.log(this.extraccionEfectivo +" "+this.caja.totalEfectivo)
    if(this.extraccionEfectivo > this.caja.totalEfectivo){
      alert("La extracción en Efectivo es mayor que el monto actual");
      return;
    }

    if(this.extraccionCredito > this.caja.totalCredito){
      alert("La extracción en Crédito es mayor que el monto actual");
      return;
    }

    if(this.extraccionDebito > this.caja.totalDebito){
      alert("La extracción en Débito es mayor que el monto actual");
      return;
    }

    var cierreEfectivo = new MovimientoCaja(this.authenticationService.getUID(),this.authenticationService.getNombre());
    cierreEfectivo.id = this.firestore.createId();
    cierreEfectivo.cajaId = this.caja.id;
    cierreEfectivo.isCierre = true;
    cierreEfectivo.metodoPago = "Efectivo";
    cierreEfectivo.monto = - Number(this.extraccionEfectivo);
    this.movimientosService.createMovimientoCaja(this.caja,cierreEfectivo);

    var cierreDebito = new MovimientoCaja(this.authenticationService.getUID(),this.authenticationService.getNombre());
    cierreDebito.id = this.firestore.createId();
    cierreDebito.cajaId = this.caja.id;
    cierreDebito.isCierre = true;
    cierreDebito.metodoPago = "Débito";
    cierreDebito.monto = - Number(this.extraccionDebito);
    this.movimientosService.createMovimientoCaja(this.caja,cierreDebito);

    var cierreCredito = new MovimientoCaja(this.authenticationService.getUID(),this.authenticationService.getNombre());
    cierreCredito.id = this.firestore.createId();
    cierreCredito.cajaId = this.caja.id;
    cierreCredito.isCierre = true;
    cierreCredito.metodoPago = "Crédito";
    cierreCredito.monto = - Number(this.extraccionCredito);
    this.movimientosService.createMovimientoCaja(this.caja,cierreCredito);

    this.navCtrl.back();
  }

  cancelar(){
    this.navCtrl.back();
  }

}
