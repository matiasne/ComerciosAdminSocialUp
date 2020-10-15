import { Component, OnInit } from '@angular/core';
import { ListClientesPage } from '../list-clientes/list-clientes.page';
import { ModalController, NavController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ListComerciosOwnerPage } from '../list-comercios-owner/list-comercios-owner.page';
import { AuthenticationService } from '../Services/authentication.service';
import { CtaCorriente } from '../models/ctacorriente';
import { CtaCorrientesService } from '../Services/cta-corrientes.service';
import { ActivatedRoute } from '@angular/router';
import { ClientesService } from '../Services/clientes.service';
import { ComerciosService } from '../Services/comercios.service';
import { Subscription } from 'rxjs';
import { ToastService } from '../Services/toast.service';
import { SelectClientePage } from '../select-cliente/select-cliente.page';

@Component({
  selector: 'app-form-cta-corriente',
  templateUrl: './form-cta-corriente.page.html',
  styleUrls: ['./form-cta-corriente.page.scss'],
})
export class FormCtaCorrientePage implements OnInit {

  datosForm: FormGroup;
  
  public clientes =[];
  public comercios =[];
  public ctaCorriente:CtaCorriente;
  submitted = false;

  public ctaSubs:Subscription;
  public clienteSubs:Subscription;

  public updating:boolean = false;
  public titulo = "Nuevo Cta. Corriente";

  constructor(
    private modalController:ModalController,
    private formBuilder: FormBuilder,
    private authenticationService:AuthenticationService,
    private ctaCorrienteService:CtaCorrientesService,
    private navCtrl:NavController,
    private route: ActivatedRoute,
    private ctasCorreintesService:CtaCorrientesService,
    private clientesServices:ClientesService,
    private comerciosServices:ComerciosService,
    private toastServices:ToastService,
  ) {

    this.ctaCorriente = new CtaCorriente(this.authenticationService.getUID(),this.authenticationService.getNombre());

    this.datosForm = this.formBuilder.group({
      nombre: ['', Validators.required],          
      coTitularesId:['', Validators.required],
      vendedor_nombre:[this.authenticationService.getEmail(), Validators.required],
      montoTotal:[0],
     
    });

    if(this.route.snapshot.params.id){
      this.updating = true;
      this.titulo = "Editar Cta. Corriente"

      this.ctaSubs =this.ctasCorreintesService.get(this.route.snapshot.params.id).subscribe(snapshot =>{
        this.ctaCorriente.asignarValores(snapshot.payload.data());
        this.ctaCorriente.id = snapshot.payload.id;
        this.datosForm.patchValue(this.ctaCorriente); 
                   
        this.ctaCorriente.coTitularesId.forEach(titularId => {
          this.clienteSubs = this.clientesServices.get(titularId).subscribe(snap =>{
            let client:any = snap.payload.data();
            client.id = snap.payload.id;
            this.clientes.push(client);
          })
        });       
       
        
  
      })

    }
    



   }

  ngOnInit() {
  }

  ionViewDidEnter(){
    
  }

  ionViewDidLeave(){
    if(this.updating){
      this.ctaSubs.unsubscribe();
      this.clienteSubs.unsubscribe();
    }
      
  }

  get f() { return this.datosForm.controls; }

  async seleccionarCliente(){
    const modal = await this.modalController.create({
      component: SelectClientePage      
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data)
        this.clientes.push(retorno.data.item);        
    });
    return await modal.present();
  }

  eliminarCliente(i){
    this.clientes.splice(i,1);
  }

 

  guardar(){
    this.submitted = true;

    var clientesId =[]
    this.clientes.forEach(cliente=>{
      clientesId.push(cliente.id);
    })
    this.datosForm.patchValue({
      coTitularesId: clientesId    
    });

    console.log(this.datosForm.value);

    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    } 

    this.ctaCorriente.asignarValores(this.datosForm.value);
    
    if(!this.updating)
      this.ctaCorrienteService.create(this.ctaCorriente);
    else{
      console.log("update")
      this.ctaCorrienteService.update(this.ctaCorriente);
    }     

    this.navCtrl.back();
  }

  cancelar(){
    this.navCtrl.back();
  }

  eliminar(){
    this.ctasCorreintesService.delete(this.ctaCorriente);
    this.navCtrl.back();
  }

}
