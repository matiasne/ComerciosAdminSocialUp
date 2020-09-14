import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { LoadingService } from '../Services/loading.service';
import { CajasService } from '../Services/cajas.service';
import { MovimientoCaja } from '../models/movimientoCaja';
import { MovimientosService } from '../Services/movimientos.service';
import { Caja } from '../models/caja';
import { ToastService } from '../Services/toast.service';

@Component({
  selector: 'app-form-egreso-caja',
  templateUrl: './form-egreso-caja.page.html',
  styleUrls: ['./form-egreso-caja.page.scss'],
})
export class FormEgresoCajaPage implements OnInit {

  public datosForm: FormGroup;
  submitted = false;
  public totalActual=0;
  public caja:Caja;
  private egreso:MovimientoCaja;

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private cajasService:CajasService,
    private authenticationService:AuthenticationService,
    private firestore:AngularFirestore,
    private movimientosService:MovimientosService,
    private toastServices:ToastService,
  ) { 

    this.caja = new Caja();
    this.egreso = new MovimientoCaja(this.authenticationService.getUID(), this.authenticationService.getNombre());
    this.egreso.id = this.firestore.createId();

    this.totalActual = this.route.snapshot.params.totalActual;

    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    this.cajasService.get(this.route.snapshot.params.cajaId).subscribe(caja =>{
      this.caja.id = caja;
    })
    
    this.datosForm = this.formBuilder.group({
      cajaId:[this.route.snapshot.params.cajaId,Validators.required],
      monto: ['', Validators.required],
      motivo:['', Validators.required]
    });

   }

   get f() { return this.datosForm.controls; }

  ngOnInit() {
  }

  guardar(){

    this.submitted = true;
    
    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    } 

    console.log()
    if(this.datosForm.controls.monto.value > this.route.snapshot.params.totalActual){
      this.toastServices.alert("El monto de egreso no puede ser mayor al monto total de efectivo en caja","");
      return;
    }

   
    this.egreso.asignarValores(this.datosForm.value);
    this.egreso.metodoPago = "Efectivo";
    this.egreso.monto = - Number(this.datosForm.controls.monto.value);
    this.movimientosService.createMovimientoCaja(this.caja,this.egreso);
    
    this.navCtrl.back();
  }

  cancelar(){
    this.navCtrl.back();
  }

}
