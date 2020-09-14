import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';
import { NavController, ModalController } from '@ionic/angular';
import { Cliente } from '../models/cliente';
import { CtaCorrientesService } from '../Services/cta-corrientes.service';
import { ListClientesPage } from '../list-clientes/list-clientes.page';
import { LoadingService } from '../Services/loading.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { MovimientoCtaCorriente } from '../models/movimientoCtaCorriente';
import { MovimientoCaja } from '../models/movimientoCaja';
import { CajasService } from '../Services/cajas.service';
import { MovimientosService } from '../Services/movimientos.service';
import { Caja } from '../models/caja';
import { ToastService } from '../Services/toast.service';

@Component({
  selector: 'app-form-ingreso-caja',
  templateUrl: './form-ingreso-caja.page.html',
  styleUrls: ['./form-ingreso-caja.page.scss'],
})
export class FormIngresoCajaPage implements OnInit {

  public datosForm: FormGroup;
  submitted = false;
  public totalActual=0;
  public metodoPagoSeleccionado ="Efectivo";
  public cliente:Cliente;
  public ctasCorrientes = [];
  public ctaCorrienteSelecccionadaId ="";
  
  private pago:MovimientoCaja;
  public caja:Caja;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authenticationService:AuthenticationService,
    private navCtrl:NavController,
    private ctasCorrientesService:CtaCorrientesService,
    private loadingService:LoadingService,
    private modalController:ModalController,
    private firestore:AngularFirestore,
    private ctaCorrienteService:CtaCorrientesService,
    private cajasService:CajasService,
    private movimientosService:MovimientosService,
    private toastServices:ToastService,
  ) { 

    this.cliente = new Cliente();
    this.caja = new Caja();

    this.datosForm = this.formBuilder.group({
      cajaId:[this.route.snapshot.params.cajaId,Validators.required],
      monto: ['', Validators.required],
      motivo:['', Validators.required]
    });

    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    this.cajasService.get(this.route.snapshot.params.cajaId).subscribe((caja:any) =>{
      this.caja = caja;
    })

  }

  get f() { return this.datosForm.controls; }

  ngOnInit() {

  }

  setearCtaCorriente(){
    console.log(this.ctaCorrienteSelecccionadaId)
  }

  guardar(){
  
    this.submitted = true;

    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    } 

    console.log()
    if(this.datosForm.controls.monto.value > this.route.snapshot.params.totalActual){
      alert("El monto de egreso no puede ser mayor al monto total de efectivo en caja");
      return;
    }

    console.log
    
    var pago = new MovimientoCaja(this.authenticationService.getUID(), this.authenticationService.getNombre());      
    pago.id = this.firestore.createId();
    pago.cajaId = this.caja.id;
    pago.metodoPago = this.metodoPagoSeleccionado;
    pago.monto= this.datosForm.controls.monto.value;
   

    if(this.metodoPagoSeleccionado == "Cta. Corriente"){
      var deposito = new MovimientoCtaCorriente(this.authenticationService.getUID(),this.authenticationService.getNombre());
      deposito.id = this.firestore.createId();
      deposito.cajaId = this.caja.id;
      deposito.motivo = "Ingreso desde caja";
      deposito.pagoId = pago.id;
      deposito.monto = this.datosForm.controls.monto.value;
      deposito.ctaCorrienteId = this.ctaCorrienteSelecccionadaId;
      this.movimientosService.crearMovimientoCtaCorriente(deposito);   
         
      pago.depositoId = deposito.id;
      pago.ctaCorrienteId = this.ctaCorrienteSelecccionadaId;
    }
    
    
    
    console.log(this.caja.id);
    this.movimientosService.createMovimientoCaja(this.caja,pago);


    this.navCtrl.back();
  }

  async seleccionarCliente(){
    this.loadingService.presentLoading();
    const modal = await this.modalController.create({
      component: ListClientesPage      
    });

    modal.present().then(()=>{
      
    })

    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){
        this.cliente.asignarValores(retorno.data.item);
        this.getCuentasCorrientes(retorno.data.item)
      }        
    });
    return await modal.present();
  }

  eliminarCliente(){
    this.cliente = new Cliente();
  }

  getCuentasCorrientes(cliente){
    this.ctasCorrientesService.getByCliente(cliente).subscribe(snapshot =>{
      this.ctasCorrientes =[];
      snapshot.forEach((snap: any) => {           
          var item = snap.payload.doc.data();
          item.id = snap.payload.doc.id;              
          this.ctasCorrientes.push(item);
          console.log(this.ctasCorrientes);             
      });
    })
  }

  cancelar(){
    this.navCtrl.back();
  }

}
