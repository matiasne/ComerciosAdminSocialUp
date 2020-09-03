import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ListClientesPage } from '../list-clientes/list-clientes.page';
import { Router, ActivatedRoute } from '@angular/router';
import { ListServiciosPage } from '../list-servicios/list-servicios.page';
import { DataService } from '../Services/data.service';
import { SubscripcionesService } from '../Services/subscripciones.service';
import { AuthenticationService } from '../Services/authentication.service';
import { AddServicioSubscripcionPage } from '../add-servicio-subscripcion/add-servicio-subscripcion.page';
import { ToastService } from '../Services/toast.service';
import { Subscripcion } from '../models/subscripcion';
import { ClientesService } from '../Services/clientes.service';
import { PlanesService } from '../Services/planes.service';
import { Servicio } from '../models/servicio';
import { ServiciosService } from '../Services/servicios.service';


@Component({
  selector: 'app-form-subscripcion',
  templateUrl: './form-subscripcion.page.html',
  styleUrls: ['./form-subscripcion.page.scss'],
})
export class FormSubscripcionPage implements OnInit {

  public datosForm: FormGroup;
  
  public cliente;
  public servicio;
  public planes;

  submitted = false;
  subs:any;
  titulo ="Nueva Subscripción";
  updating =false;

  constructor(
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    public router:Router,
    public dataService:DataService,
    public subscripcionService:SubscripcionesService,
    private clientesService:ClientesService,
    private servicioService:ServiciosService,
    private planesService:PlanesService,
    public authService:AuthenticationService,
    private toastServices:ToastService,
    private route: ActivatedRoute,
  ) { 

    this.datosForm = this.formBuilder.group({
      plan: ['', Validators.required],
      pagoAdelantado :['', Validators.required],
      descipcion :[''],
      clienteRef:['', Validators.required],
      servicioRef:['', Validators.required],
      vendedorRef:['',Validators.required],
      vendedor_nombre:[''],
      createdAt:[''],
      fechaInicio:['']
    });

   

    if(this.route.snapshot.params.id){
      
      this.updating = true;
      this.titulo = "Editar Subscripción";
      this.subs = this.subscripcionService.get(this.route.snapshot.params.id).subscribe(data=>{
        this.datosForm.patchValue(data.payload.data())
        
       
      });
    }
    else{
      
    }

  }

  ngOnInit() {

  }

  async seleccionarCliente(){
    const modal = await this.modalController.create({
      component: ListClientesPage      
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data)
        this.cliente = retorno.data.item        
    });
    return await modal.present();
  }

  async seleccionarServicio(){
    const modal = await this.modalController.create({
      component: ListServiciosPage      
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){
        console.log(retorno.data);
        if(retorno.data){
          this.agregarServicio(retorno.data.item);        
        }        
      }    
    });
    return await modal.present();
  }

  async agregarServicio(servicio){
    
    const modal = await this.modalController.create({
      component: AddServicioSubscripcionPage,
      componentProps: { servicio: servicio }
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){
        this.servicio = retorno.data.item;        
      }
    });
    return await modal.present();
    

  }


  eliminarCliente(){
    this.cliente = "";
  }

  eliminarServicio(){
    this.servicio = "";
  }

  get f() { return this.datosForm.controls; }

  guardar(){

    this.submitted = true;

    var vendedorId = this.authService.getUID();
    console.log(vendedorId)
    this.datosForm.patchValue({
      vendedorRef: this.authService.getRef(vendedorId)
    });

    this.datosForm.patchValue({
      servicioRef: this.servicioService.getRef(this.servicio.id)
    });

    this.datosForm.patchValue({
      clienteRef: this.clientesService.getRef(this.cliente.id)
    });

    this.datosForm.patchValue({
      planRef: this.clientesService.getRef(this.servicio.plan.id)
    });

    this.datosForm.patchValue({
      pagoAdelantado: this.servicio.pagoAdelantado
    });

    this.datosForm.patchValue({
      descipcion_venta: this.servicio.descripcion_venta
    });

    this.datosForm.patchValue({
      fechaInicio: this.servicio.fechaInicio
    });

   

   

    var vendedor_nombre = this.authService.getNombre();
    console.log(vendedorId)
    this.datosForm.patchValue({
      vendedor_nombre: vendedor_nombre
    });


    console.log(this.datosForm.value);

    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    } 

    this.subscripcionService.add(this.datosForm.value).then(data=>{
      console.log(data);
    });

    
  }

}
