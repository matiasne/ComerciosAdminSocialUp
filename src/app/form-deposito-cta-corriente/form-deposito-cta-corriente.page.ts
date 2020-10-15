import { Component, OnInit } from '@angular/core';
import { Cliente } from '../models/cliente';
import { ListClientesPage } from '../list-clientes/list-clientes.page';
import { ModalController, NavController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../Services/authentication.service';
import { CtaCorrientesService } from '../Services/cta-corrientes.service';
import { Subscription } from 'rxjs';
import { CarritoService } from '../Services/global/carrito.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { CajasService } from '../Services/cajas.service';
import { ActivatedRoute } from '@angular/router';
import { Caja } from '../models/caja';
import { MovimientoCtaCorriente } from '../models/movimientoCtaCorriente';
import { MovimientoCaja } from '../models/movimientoCaja';
import { MovimientosService } from '../Services/movimientos.service';
import { ToastService } from '../Services/toast.service';
import { SelectClientePage } from '../select-cliente/select-cliente.page';

@Component({
  selector: 'app-form-deposito-cta-corriente',
  templateUrl: './form-deposito-cta-corriente.page.html',
  styleUrls: ['./form-deposito-cta-corriente.page.scss'],
})
export class FormDepositoCtaCorrientePage implements OnInit {

  public monto = 0;
  private deposito:MovimientoCtaCorriente;
  public cliente:Cliente;
  public cajas=[];
  public caja:Caja;
  public cajaSeleccionada:any;
  datosForm: FormGroup; 
  public submitted = false;

  public ctaSubs:Subscription;
  public clienteSubs:Subscription;

  public updating:boolean = false;
  public titulo = "Nuevo Cta. Corriente";

  public metodoPagoSeleccionado="";

  constructor(
    private modalController:ModalController,
    private navCtrl:NavController,
    private formBuilder: FormBuilder,
    private authenticationService:AuthenticationService,
    private carritoService:CarritoService,
    private firestore:AngularFirestore,
    private ctaCorrienteService:CtaCorrientesService,
    private cajasService:CajasService,
    public route:ActivatedRoute,
    private movimientosService:MovimientosService,
    private toastServices:ToastService
  ) { 

    this.deposito = new MovimientoCtaCorriente(this.authenticationService.getUID(),this.authenticationService.getNombre());
    this.deposito.id = this.firestore.createId();
    this.deposito.ctaCorrienteId = this.route.snapshot.params.id;

    this.cliente = new Cliente();
    this.caja = new Caja();
  }

  ngOnInit() {

    this.datosForm = this.formBuilder.group({
      monto: ['', Validators.required],          
      clienteId:['', Validators.required],
      cajaId:['', Validators.required],
      metodoPago:['',Validators.required],
      motivo:['']   
    });

    
    this.cajasService.list().subscribe((cajas:any)=>{                 
      this.cajas =cajas;
      
    });
    
  }

  ionViewDidEnter(){
    
  }

  setearCliente(cliente){
    this.cliente = cliente;
    this.datosForm.patchValue({
      clienteId:cliente.id
    });
    this.carritoService.setearCliente(cliente);
  }

  setearMetodoPago(){
    console.log(this.metodoPagoSeleccionado)
    this.deposito.metodoPago = this.metodoPagoSeleccionado;
    this.datosForm.patchValue({
      metodoPago:this.metodoPagoSeleccionado
    });
  }


  async seleccionarCliente(){
    const modal = await this.modalController.create({
      component: SelectClientePage      
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){
        
        this.setearCliente(retorno.data.item);
      }        
    });
    return await modal.present();
  }

  seleccionarCaja(){
    this.caja.asignarValores(this.cajaSeleccionada);
    this.datosForm.patchValue({
      cajaId:this.caja.id
    });
  }

  obtenerDatos(){

    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    this.cajasService.get(this.datosForm.controls.cajaId.value).subscribe(caja=>{      
      this.caja = caja;
    })
  }

  get f() { return this.datosForm.controls; }

  guardar(){   

    this.submitted = true;
    console.log(this.datosForm.controls.motivo.value+"!!!!!!!!!!!!!!!!!")
    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    } 

    this.deposito.asignarValores(this.datosForm.value);


    var pago = new MovimientoCaja(this.authenticationService.getUID(), this.authenticationService.getNombre());      
    pago.id = this.firestore.createId();
    pago.clienteId = this.cliente.id;
    pago.cajaId = this.caja.id;
    pago.metodoPago = this.metodoPagoSeleccionado;
    pago.ctaCorrienteId = this.deposito.ctaCorrienteId;
    pago.depositoId = this.deposito.id;
    pago.monto = this.deposito.monto;
    pago.motivo = this.datosForm.controls.motivo.value;
    this.movimientosService.createMovimientoCaja(this.caja,pago);

    this.carritoService.setearCaja(this.datosForm.controls.cajaId.value); 

    this.deposito.cajaId =this.caja.id;
    this.deposito.pagoId = pago.id;
    this.deposito.motivo = pago.motivo;
    this.deposito.ctaCorrienteId = this.deposito.ctaCorrienteId;
    this.movimientosService.crearMovimientoCtaCorriente(this.deposito);   

    this.navCtrl.back();
  }

  eliminarCliente(){
    this.cliente = new Cliente();
  }

  cancelar(){
    this.navCtrl.back();
  }

  

}
