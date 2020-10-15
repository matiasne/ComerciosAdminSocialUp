import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ListClientesPage } from '../list-clientes/list-clientes.page';
import { Router } from '@angular/router';
import { ListServiciosPage } from '../list-servicios/list-servicios.page';
import { DataService } from '../Services/data.service';
import { SubscripcionesService } from '../Services/subscripciones.service';
import { VentasService } from '../Services/ventas.service';
import { AuthenticationService } from '../Services/authentication.service';
import { AddProductoVentaPage } from '../add-producto-venta/add-producto-venta.page';
import { ToastService } from '../Services/toast.service';
import { SelectClientePage } from '../select-cliente/select-cliente.page';

@Component({
  selector: 'app-form-venta',
  templateUrl: './form-venta.page.html',
  styleUrls: ['./form-venta.page.scss'],
})
export class FormVentaPage implements OnInit {

  public datosForm: FormGroup;
  
  public cliente;
  public productos = [];
  public planes;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    public router:Router,
    public dataService:DataService,
    public ventasService:VentasService,
    public authService:AuthenticationService,
    private toastServices:ToastService,
  ) { }

  ngOnInit() {

    this.datosForm = this.formBuilder.group({
      clienteId: ['', Validators.required],
      productos :['', Validators.required],
      vendedorId:['',Validators.required],
      vendedor_nombre:['']
    });

  }

  async seleccionarCliente(){
    const modal = await this.modalController.create({
      component: SelectClientePage      
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data)
        this.cliente = retorno.data.item
        
    });
    return await modal.present();
  }

  

  async agregarProducto(producto){
    
    const modal = await this.modalController.create({
      component: AddProductoVentaPage,
      componentProps: { producto: producto }
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){
        this.productos.push(retorno.data.item);        
      }
    });
    return await modal.present();
    

  }

  eliminarCliente(){
    this.cliente = "";
  }

  eliminarProducto(index){
    this.productos.splice(index,1);
  }

  get f() { return this.datosForm.controls; }

  guardar(){

    this.submitted = true;

    this.datosForm.patchValue({
      productos: this.productos 
    });

    this.datosForm.patchValue({
      vendedorId: this.authService.getUID() 
    });

    this.datosForm.patchValue({
      vendedor_nombre: this.authService.getNombre() 
    });

    this.datosForm.patchValue({
      clienteId: this.cliente.id
    });   


    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    } 

   
    this.ventasService.create(this.datosForm.value);

    
  }

}
