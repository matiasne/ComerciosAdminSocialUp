import { Component, OnInit } from '@angular/core';
import { Cliente } from '../models/cliente';
import { ListClientesPage } from '../list-clientes/list-clientes.page';
import { ModalController, NavController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../Services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { CtaCorrientesService } from '../Services/cta-corrientes.service';
import { ClientesService } from '../Services/clientes.service';
import { Subscribable, Subscription } from 'rxjs';
import { CarritoService } from '../Services/global/carrito.service';
import { CajasService } from '../Services/cajas.service';
import { Carrito } from '../models/carrito';
import { AngularFirestore } from 'angularfire2/firestore';
import { MovimientoCtaCorriente } from '../models/movimientoCtaCorriente';
import { MovimientosService } from '../Services/movimientos.service';
import { ToastService } from '../Services/toast.service';

@Component({
  selector: 'app-form-extraccion-cta-corriente',
  templateUrl: './form-extraccion-cta-corriente.page.html',
  styleUrls: ['./form-extraccion-cta-corriente.page.scss'],
})
export class FormExtraccionCtaCorrientePage implements OnInit {

  private extraccion:MovimientoCtaCorriente;

  public cliente:Cliente;
  public cajaSeleccionada:any;
  
  datosForm: FormGroup; 

  public ctaSubs:Subscription;
  public clienteSubs:Subscription;
  public cajasSubs:Subscription;

  public updating:boolean = false;
  public titulo = "Nuevo Cta. Corriente";

  

  constructor(
    private modalController:ModalController,
    private navCtrl:NavController,
    private formBuilder: FormBuilder,
    private authenticationService:AuthenticationService,
    private ctasCorreintesService:CtaCorrientesService,
    private carritoService:CarritoService,
    private firestore: AngularFirestore,
    public route:ActivatedRoute,
    private movimientosService:MovimientosService,
    private toastServices:ToastService,
  ) { 
    
    this.cliente = new Cliente();

    this.extraccion = new MovimientoCtaCorriente(this.authenticationService.getUID(), this.authenticationService.getNombre());
    this.extraccion.id = this.firestore.createId();
    this.extraccion.ctaCorrienteId = this.route.snapshot.params.id;

  }

  ngOnInit() {

    this.datosForm = this.formBuilder.group({
      monto: ['', Validators.required],          
      clienteId:['', Validators.required],
      cajaId:['', Validators.required],
      motivo:['']   
    });

    //Extraccion no tiene ectaulización, directamente se elimina   

  }

  setearCliente(cliente){
    this.datosForm.patchValue({
      clienteId:cliente.id
    });
    this.carritoService.setearCliente(cliente);
  }

  setearCaja(){ 

    this.carritoService.setearMetodoPago("Efectivo");
    this.datosForm.patchValue({
      cajaId:this.cajaSeleccionada.id
    });         
    this.carritoService.setearCaja(this.cajaSeleccionada.id);    
  }

  async seleccionarCliente(){
    const modal = await this.modalController.create({
      component: ListClientesPage      
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){

        this.setearCliente(retorno.data.item);
      }        
    });
    return await modal.present();
  }

  get f() { return this.datosForm.controls; }

  guardar(){
   
    this.datosForm.patchValue(this.extraccion);

    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    }    

    this.extraccion.asignarValores(this.datosForm.value);  
    this.extraccion.monto = -Number(this.datosForm.controls.monto.value);
    this.movimientosService.crearMovimientoCtaCorriente(this.extraccion);
  
    this.navCtrl.back();
  }

  eliminarCliente(){
    this.cliente = new Cliente();
  }

  cancelar(){
    this.navCtrl.back();
  }

}
