import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, ModalController, AlertController, NavParams } from '@ionic/angular';
import { CategoriasService } from '../Services/categorias.service';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from '../models/categoria';
import { Mesa } from '../models/mesa';
import { MesasService } from '../Services/mesas.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { SelectEmpleadoPage } from '../select-empleado/select-empleado.page';
import { RolesService } from '../Services/roles.service';
import { FormInvitacionPage } from '../form-invitacion/form-invitacion.page';
import { Rol } from '../models/rol';
import { ToastService } from '../Services/toast.service';
import { InvitacionesService } from '../Services/invitaciones.service';

@Component({
  selector: 'app-form-mesa',
  templateUrl: './form-mesa.page.html',
  styleUrls: ['./form-mesa.page.scss'],
})
export class FormMesaPage implements OnInit {

  datosForm: FormGroup;
  submitted = false;

  public updating:boolean = false;
  public comercioId = "";
  public mesa:Mesa;

  public title = 'app';
  public elementType = 'url';
  public value = 'Techiediaries';

  public encargados =[];  
  public rolesNuevos = [];
  public titulo ="";

  public url="";
  
  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,    
    private categoriasService:CategoriasService,
    public modalCtrl: ModalController,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private mesasServices:MesasService,
    private firestore: AngularFirestore,
    private barcodeScanner: BarcodeScanner,
    private rolesServices:RolesService,
    private toastServices:ToastService,
    public invitacionesService:InvitacionesService
    
    
  ) {
    this.datosForm = this.formBuilder.group({
      nombre: ['', Validators.required],
    });    
  }

  ngOnInit() {

    this.mesa = new Mesa();
   

    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    this.comercioId = comercio_seleccionadoId;
    this.datosForm = this.formBuilder.group({
      nombre: ['', Validators.required],
    });

    if(this.route.snapshot.params.id){
      
      var sub = this.mesasServices.get(this.route.snapshot.params.id).subscribe(mesa =>{
        
        this.mesa.asignarValores(mesa);
        console.log(this.mesa)
        this.updating = true;
        this.titulo = "Editar Mesa";
        this.datosForm = this.formBuilder.group({
          nombre: [this.mesa.nombre, Validators.required],
        });       

        this.url = "https://socialup.web.app/details-comercio;id="+comercio_seleccionadoId+";mesaId="+this.mesa.id;
        this.create(this.url);

        
        sub.unsubscribe();

      })
      
    }   
    else{
      this.titulo = "Nueva Mesa";
      this.mesa.id = this.firestore.createId();
      this.mesa.comercioId = comercio_seleccionadoId; 
      this.value = "https://socialup.web.app";
      this.create("https://socialup.web.app/details-comercio;id="+comercio_seleccionadoId+";mesaId="+this.mesa.id);
    }    
   
   
   

  }

  

  async agregarEncargado(){
    const modal = await this.modalCtrl.create({
      component: FormInvitacionPage,
      componentProps: {
        rol:"encargado"      
      }
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){   
        this.invitacionesService.enviarInvitacion(retorno.data,"encargado");
      }        
    });
    return await modal.present();
  }

  eliminarEncargado(index){  

    
  }


  public create(data) {
    this.value =data;
  }

  get f() { return this.datosForm.controls; }

  guardar(){

    this.submitted = true;
    // stop here if form is invalid

    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    }   

    this.mesa.nombre = this.datosForm.controls.nombre.value;

    

    if(this.updating){
      this.mesasServices.update(this.mesa);
    }
    else{
      this.mesasServices.add(this.mesa);
    }

    this.navCtrl.back();
  }

  cancelar(){
    this.navCtrl.back();
  }

  elimiar(){
    this.presentAlertEliminar();
  }

  async presentAlertEliminar() {
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: 'Está seguro que desea eliminar la mesa?',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.mesasServices.delete(this.mesa.id);
            this.navCtrl.back();
          }
        }
      ]
    });
    await alert.present();
  }

}
