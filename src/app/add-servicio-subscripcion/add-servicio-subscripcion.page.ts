import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { SubscripcionesService } from '../Services/subscripciones.service';
import { AuthenticationService } from '../Services/authentication.service';
import { PlanesService } from '../Services/planes.service';
import { Cliente } from '../models/cliente';
import { CarritoService } from '../Services/global/carrito.service';
import { ServiciosService } from '../Services/servicios.service';
import { Servicio } from '../models/servicio';
import { LoadingService } from '../Services/loading.service';
import { FormPlanPage } from '../form-plan/form-plan.page';
import { ToastService } from '../Services/toast.service';
import { ClientesService } from '../Services/clientes.service';
import { Subscripcion } from '../models/subscripcion';
import { SelectClientePage } from '../select-cliente/select-cliente.page';

@Component({
  selector: 'app-add-servicio-subscripcion',
  templateUrl: './add-servicio-subscripcion.page.html',
  styleUrls: ['./add-servicio-subscripcion.page.scss'],
})
export class AddServicioSubscripcionPage implements OnInit {

  public datosForm: FormGroup;  
  servicio:Servicio;
  planes:any=[];
  plan:any ="";
  public cliente:Cliente;
  public subscripcionOn = false;
  public subscripcion:Subscripcion;
  public submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private planesService:PlanesService,
    private authenticationService:AuthenticationService,
    private subscripcionesService:SubscripcionesService,
    public modalController: ModalController,
    public carritoService:CarritoService,
    private navCtrl: NavController,
    public route:ActivatedRoute,
    public servicioService:ServiciosService,
    private loadingService:LoadingService,
    private toastServices:ToastService,
    private clientesService:ClientesService
  ) {

    this.subscripcion = new Subscripcion("","");
    this.cliente = new Cliente();
    this.servicio = new Servicio();
    console.log(this.servicio);

    this.datosForm = this.formBuilder.group({
      plan: ['', Validators.required],
      pagoAdelantado :['true', Validators.required],
      fechaInicio:[this.currentDate()]
    }); 

  }

  ionViewDidEnter(){
  
    this.datosForm.patchValue({
      subscripcionOn: "false"
    })

    this.datosForm.patchValue({
      pagoAdelantado: "true"
    }) 

    if(this.route.snapshot.params.id){
      var subs = this.servicioService.get(this.route.snapshot.params.id).subscribe(servicio=>{        
        this.servicio.asignarValores(servicio);
        this.servicio.pagoAdelantado = "true";
        this.loadingService.dismissLoading();
        this.loadingService.presentLoading();
        this.planesService.setPathIds(this.servicio.id); 
        this.planesService.list().subscribe(items=>{                 
          this.planes = items;
          this.loadingService.dismissLoading();
        });        
        subs.unsubscribe();
      })
    }
  }

  ionViewDidLeave(){
   
  }

  ngOnInit() {

    
   
  }

  async seleccionarCliente(){
    const modal = await this.modalController.create({
      component: SelectClientePage      
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data)
        this.cliente = retorno.data.item;
        
    });
    return await modal.present();
  }

  eliminarCliente(){
    this.cliente = new Cliente();
  }

  currentDate() {
    const currentDate = new Date();
    return currentDate.toISOString().substring(0,10);
  }

  async crearNuevoPlan(){    
    const modal = await this.modalController.create({
      component: FormPlanPage,
      componentProps: {servicioId: this.servicio.id}
    });
    return await modal.present();
  }

  get f() { return this.datosForm.controls; }

  agregar(){

    this.submitted = true;

    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    } 

    if(this.cliente.id == ""){
      this.toastServices.alert("Por favor seleccione un cliente antes de continuar","");
      return;
    }

    this.servicio.pagoAdelantado = this.datosForm.controls.pagoAdelantado.value;
    this.servicio.fechaInicio = this.datosForm.controls.fechaInicio.value; 

    this.subscripcion.clienteId = this.cliente.id;
    this.subscripcion.clienteRef= this.clientesService.getRef(this.cliente.id);
    this.subscripcion.vendedorRef=this.authenticationService.getRef(this.authenticationService.getUID());
    this.subscripcion.vendedor_nombre=this.authenticationService.getEmail();
    this.subscripcion.servicioId= this.servicio.id;
    this.subscripcion.servicioRef=this.servicioService.getRef(this.servicio.id);
    this.subscripcion.fechaInicio=this.servicio.fechaInicio;
    if(this.datosForm.controls.plan.value != 'personal'){
      this.servicio.plan = this.datosForm.controls.plan.value;
      this.subscripcion.planRef=this.planesService.getRef(this.servicio.plan.id);
    }
    this.subscripcion.pagoAdelantado= this.servicio.pagoAdelantado;
    this.subscripcion.descipcion_venta= this.servicio.descripcion_venta;
    
      
    console.log(this.subscripcion);
    this.subscripcionesService.add(this.subscripcion).then(data=>{
      console.log(data)
    });
    this.toastServices.mensaje("Subscripción creada!","");
    
    if(this.servicio.pagoAdelantado == "true"){
      this.carritoService.setearCliente(this.cliente);
      if(this.datosForm.controls.plan.value == 'personal'){ 
        this.servicio.plan.nombre = 'Personal';
        this.servicio.plan.precio = this.subscripcion.precio;
        this.servicio.plan.tipo = this.subscripcion.tipo;
        this.servicio.plan.dias = this.subscripcion.dias;       
      } 

      this.toastServices.mensaje("Se agregó la primer cuota al carrito","");
    } 
    this.navCtrl.back();
    
  }

  cancelar(){
    this.navCtrl.back();
  }

}
