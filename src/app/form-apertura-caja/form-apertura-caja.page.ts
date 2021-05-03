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
  selector: 'app-form-apertura-caja',
  templateUrl: './form-apertura-caja.page.html',
  styleUrls: ['./form-apertura-caja.page.scss'],
})
export class FormAperturaCajaPage implements OnInit {

  private enumTipoMovimientoCaja = EnumTipoMovimientoCaja
  
  public datosForm: FormGroup;  
  public fecha = new Date();
  public cajaId = "";
  submitted = false;
  public totalActual=0;
  public caja:Caja;

  public efectivo = 0;
  public debito = 0;
  public credito = 0;

  public movSub:Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private authenticationService:AuthenticationService,
    private cajasServices:CajasService,
    private movimientosService:MovimientosService,
    private firestore: AngularFirestore,
  ) {
    this.caja = new Caja();
   }

  ngOnInit() {

    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    this.movSub = this.cajasServices.get(this.route.snapshot.params.cajaId).subscribe(data =>{
      this.caja.asignarValores(data);
      console.log(this.caja)
    })

  }

  ionViewDidLeave(){
    this.movSub.unsubscribe();
  }

  abrir(){
    this.submitted = true;

    this.caja.estado = "abierta";

    var aperturaEfectivo = new MovimientoCaja(this.authenticationService.getUID(),this.authenticationService.getEmail());
    aperturaEfectivo.tipo = this.enumTipoMovimientoCaja.apertura;
    aperturaEfectivo.cajaId = this.caja.id;
    aperturaEfectivo.isApertura = true;
    aperturaEfectivo.metodoPago = "efectivo";
    aperturaEfectivo.monto = Number(this.efectivo);
    this.movimientosService.add(aperturaEfectivo);

    var aperturaDebito = new MovimientoCaja(this.authenticationService.getUID(),this.authenticationService.getEmail());
    aperturaDebito.tipo = this.enumTipoMovimientoCaja.apertura;
    aperturaDebito.cajaId = this.caja.id;
    aperturaDebito.isApertura = true;
    aperturaDebito.metodoPago = "debito";
    aperturaDebito.monto = Number(this.debito);
    this.movimientosService.add(aperturaDebito);

    var aperturaCredito = new MovimientoCaja(this.authenticationService.getUID(),this.authenticationService.getEmail());
    aperturaCredito.tipo = this.enumTipoMovimientoCaja.apertura;
    aperturaCredito.metodoPago = "credito";
    aperturaCredito.cajaId = this.caja.id;
    aperturaCredito.isApertura = true;    
    aperturaCredito.monto = Number(this.credito);
    this.movimientosService.add(aperturaCredito);

    this.caja.estado = "abierta";

    this.caja.totalEfectivo = Number(this.efectivo);
    this.caja.totalDebito = Number(this.debito);
    this.caja.totalCredito = Number(this.credito);

    this.actualizarMontosCaja()

    this.cajasServices.update(this.caja);

    this.navCtrl.back();
  }

  cancelar(){
    this.navCtrl.back();
  }

  actualizarMontosCaja(){
  
    this.caja.totalEfectivo = Number(this.efectivo);
    this.caja.totalDebito = Number(this.debito);
    this.caja.totalCredito = Number(this.credito);

  const param1 = JSON.parse(JSON.stringify(this.caja));
  this.cajasServices.update(param1);
}

}



