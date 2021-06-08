import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { CajasService } from '../Services/cajas.service';
import { EnumTipoMovimientoCaja, MovimientoCaja } from '../models/movimientoCaja';
import { MovimientosService } from '../Services/movimientos.service';
import { Caja } from '../models/caja';
import { ToastService } from '../Services/toast.service';
import { Subscription } from 'rxjs';
import { Comercio } from '../models/comercio';
import { ComerciosService } from '../Services/comercios.service';

@Component({
  selector: 'app-form-egreso-caja',
  templateUrl: './form-egreso-caja.page.html',
  styleUrls: ['./form-egreso-caja.page.scss'],
})
export class FormEgresoCajaPage implements OnInit {

  private enumTipoMovimientoCaja = EnumTipoMovimientoCaja
  
  public datosForm: FormGroup;
  submitted = false;
  public totalActual=0;
  public cajas = []
  public cajaSeleccionadaIndex=-1;
  public cajaSeleccionada:Caja;

  public caja:Caja;
  private egreso:MovimientoCaja;
  cajasSubs:Subscription;

  public comercio:Comercio;

  public metodoPagoSeleccionado = "efectivo"

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private cajasService:CajasService,
    private authenticationService:AuthenticationService,
    private firestore:AngularFirestore,
    private movimientosService:MovimientosService,
    private toastServices:ToastService,
    private comerciosService:ComerciosService,
    private router:Router,
  ) { 
    this.comercio = new Comercio()
    this.caja = new Caja();
    this.egreso = new MovimientoCaja(this.authenticationService.getUID(), this.authenticationService.getEmail());
    this.egreso.id = this.firestore.createId();

    
    
    this.datosForm = this.formBuilder.group({
      monto: ['', Validators.required],
      motivo:['', Validators.required]
    });

   }

   get f() { return this.datosForm.controls; }

  ngOnInit() {
  }

  ionViewDidEnter(){

    this.comercio.asignarValores(this.comerciosService.getSelectedCommerceValue());
    
    this.cajas = [];
    this.cajasService.list().subscribe((cajas:any)=>{      
      for(let i=0;i <cajas.length;i++){
        if(cajas[i].estado == "abierta"){ 
          this.cajas.push(cajas[i]);
        }   
      }      
      console.log(this.cajas);
      if(this.cajas.length == 0){
        this.toastServices.alert("Debes tener al menos una caja abierta","");
        this.router.navigate(['/list-cajas']);
      }
      else{
        this.setCaja();
      }       
    });
  }

  setCaja(){

    for(let i=0;i <this.cajas.length;i++){
      if(this.cajas[i].id == this.route.snapshot.params.cajaId){ 
        this.cajaSeleccionadaIndex = i;
        this.caja = this.cajas[i]
        this.totalActual = this.cajas[i].totalEfectivo;
      }   
    } 
  }

  setearCaja(){
    this.caja = this.cajas[this.cajaSeleccionadaIndex]
    this.totalActual = this.caja[this.cajaSeleccionadaIndex].totalEfectivo;
  }

  guardar(){

    this.submitted = true;
    
    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    } 

    if (this.metodoPagoSeleccionado =="efectivo" && this.caja.id == "") {
      this.toastServices.alert('Por favor seleccione una caja antes de continuar',"");
      return;
    } 

    if(this.metodoPagoSeleccionado =="efectivo" && this.datosForm.controls.monto.value > this.totalActual){
      this.toastServices.alert("El monto de egreso no puede ser mayor al monto total de efectivo en caja","");
      return;
    }

    this.actualizarMontosCaja()
    
    if(this.comercio.config.movimientosCajas){
      this.egreso.cajaId = this.caja.id;
      this.egreso.tipo = this.enumTipoMovimientoCaja.egreso;
      this.egreso.asignarValores(this.datosForm.value);
      this.egreso.metodoPago = this.metodoPagoSeleccionado;
      this.egreso.monto = - Number(this.datosForm.controls.monto.value);
      this.egreso.motivo = this.datosForm.controls.motivo.value;
      this.movimientosService.add(this.egreso);
    }
    
    this.navCtrl.back(); 
  }

  cancelar(){
    this.navCtrl.back();
  }

  actualizarMontosCaja(){
    if(this.metodoPagoSeleccionado == "efectivo"){
      this.caja.totalEfectivo = Number(this.caja.totalEfectivo)- Number(this.datosForm.controls.monto.value);
    }
    if(this.metodoPagoSeleccionado == "credito"){
      this.caja.totalCredito = Number(this.caja.totalCredito)- Number(this.datosForm.controls.monto.value);
    }
    if(this.metodoPagoSeleccionado == "debito"){
      this.caja.totalDebito = Number(this.caja.totalDebito) - Number(this.datosForm.controls.monto.value);
    }

    const param1 = JSON.parse(JSON.stringify(this.caja));
    this.cajasService.update(param1);
  }

}
