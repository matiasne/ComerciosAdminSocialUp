import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../Services/authentication.service';
import { CajasService } from '../Services/cajas.service';
import { Caja } from '../models/caja';
import { EnumTipoMovimientoCaja, MovimientoCaja } from '../models/movimientoCaja';
import { MovimientosService } from '../Services/movimientos.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-cierre-caja',
  templateUrl: './form-cierre-caja.page.html',
  styleUrls: ['./form-cierre-caja.page.scss'],
})
export class FormCierreCajaPage implements OnInit {

  private enumTipoMovimientoCaja = EnumTipoMovimientoCaja
  
  public datosForm: FormGroup;  
  public fecha = new Date();
  public cajaId = "";
  submitted = false;
  public totalActual=0;
  public caja:Caja;

  public extraccionEfectivo = 0;
  public extraccionDebito = 0;
  public extraccionCredito = 0;

  public movSub:Subscription;
  
  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private authenticationService:AuthenticationService,
    private cajasServices:CajasService,
    private movimientosService:MovimientosService,
    private firestore: AngularFirestore,
    private cajasService:CajasService
  ) { 
    this.fecha = new Date();
    this.caja = new Caja();

    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    this.movSub = this.cajasServices.get(this.route.snapshot.params.cajaId).subscribe(data =>{
      this.caja.asignarValores(data)
    })


    
  }

  ngOnInit() { 

    //Cada caja puede extraer el efectivo y dejar el debito o el credito o retirar solo esos tickets
  }

  ionViewDidLeave(){
    this.movSub.unsubscribe();
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

    this.caja.estado = "cerrada";

    this.actualizarMontosCaja()

    this.movimientosService.setearPath(this.caja.id)

    var mov = new MovimientoCaja(this.authenticationService.getUID(),this.authenticationService.getEmail());
    mov.tipo = this.enumTipoMovimientoCaja.cierre;
    mov.cajaId = this.caja.id;
    mov.isCierre = true;
    mov.metodoPago = "efectivo";
    mov.monto = - Number(this.extraccionEfectivo);
    this.movimientosService.add(mov);

    var movDebito = new MovimientoCaja(this.authenticationService.getUID(),this.authenticationService.getEmail());
    movDebito.tipo = this.enumTipoMovimientoCaja.cierre;
    movDebito.cajaId = this.caja.id;
    movDebito.isCierre = true;
    movDebito.metodoPago = "debito";
    movDebito.monto = - Number(this.extraccionDebito);
    this.movimientosService.add(movDebito);

    var movCredito = new MovimientoCaja(this.authenticationService.getUID(),this.authenticationService.getEmail());
    movCredito.tipo = this.enumTipoMovimientoCaja.cierre;
    movCredito.cajaId = this.caja.id;
    movCredito.isCierre = true;
    movCredito.metodoPago = "credito";
    movCredito.monto = - Number(this.extraccionCredito);
    this.movimientosService.add(movCredito);

    
    this.navCtrl.back();
  }

  cancelar(){
    this.navCtrl.back();
  }

  actualizarMontosCaja(){
      this.caja.totalEfectivo = Number(this.caja.totalEfectivo)- Number(this.extraccionEfectivo);
   
      this.caja.totalCredito = Number(this.caja.totalCredito)- Number(this.extraccionCredito);
    
      this.caja.totalDebito = Number(this.caja.totalDebito) - Number(this.extraccionDebito);
    

    const param1 = JSON.parse(JSON.stringify(this.caja));
    this.cajasService.update(param1);
  }

}
