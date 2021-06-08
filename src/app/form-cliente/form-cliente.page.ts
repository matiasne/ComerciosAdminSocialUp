import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
import { ActionSheetController, ModalController, NavController, AlertController, LoadingController, NavParams } from '@ionic/angular';
import { Camera, CameraOptions} from '@ionic-native/Camera/ngx';
import { ClientesService } from '../Services/clientes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ListClientesPage } from '../list-clientes/list-clientes.page';
import { AuthenticationService } from '../Services/authentication.service';
import { LoadingService } from '../Services/loading.service';
import { Cliente } from '../models/cliente';
import { Subscription } from 'rxjs';
import { ToastService } from '../Services/toast.service';
import { SelectClientePage } from '../select-cliente/select-cliente.page';
import { AngularFirestore } from 'angularfire2/firestore';
import { BeneficiosService } from '../Services/beneficios.service';
import { ModalInputDireccionPage } from '../modal-input-direccion/modal-input-direccion.page';
import { Localizacion } from '../models/localizacion';

declare var google: any;

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.page.html',
  styleUrls: ['./form-cliente.page.scss'],
})
export class FormClientePage implements OnInit {

//  @ViewChild('map',{static: false}) mapElement: ElementRef;
//  public map: any;

  public autocomplete:any;
  public place:any;
  public markers:any =[];
  public posicion:any;
  public geocoder:any;
  public direccion_piso = "";
  public direccion_puerta ="";

  public cliente:Cliente;

  public clienteSubs:Subscription;

  datosForm: FormGroup;
  submitted = false;

  croppedImagepath = "";
  

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 5 
  };

  public updating:boolean = false;
  public titulo = "Nuevo Cliente"; 

  public campoModificado = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private imagePicker: ImagePicker,
    public actionSheetController: ActionSheetController,
    private clientesService:ClientesService,
    public router:Router,
    public modalController: ModalController,
    private authService:AuthenticationService,
    private navParams: NavParams,
    public alertController: AlertController,
    private toastServices:ToastService,
    private firestore: AngularFirestore,
    private beneficiosService:BeneficiosService
  ) { 

    this.cliente = new Cliente();
    this.datosForm = this.formBuilder.group({

      nombre: ['', Validators.required],
      documento_tipo :[''],  
      documento :[''],  
      fecha_nacimiento : [''],
      telefono:[''],   
      email:  [''],   
      descripcion :[''],      
      foto:[''],
      createdAt:[''],
      vendedorId:['']
    });

    this.datosForm.valueChanges.subscribe(val => {
      this.campoModificado = true;
      console.log("!!!!!!!!")
    });

    if(this.navParams.get('client')){
      this.updating = true;
      this.titulo = "Editar Cliente"      
      this.cliente.asignarValores(this.navParams.get('client'));  
      this.datosForm.patchValue(this.navParams.get('client'));     
      this.croppedImagepath = this.cliente.foto;      
      console.log(this.cliente);       
             
    }
    else{
      this.cliente = new Cliente();
      this.cliente.id = this.firestore.createId();        
    }
  }

  ngOnInit() {

  }

  ionViewDidEnter(){
    
  }

  ionViewDidLeave(){
    if(this.updating)
      this.clienteSubs.unsubscribe();
  }

  
  get f() { return this.datosForm.controls; }

  
  imagenSeleccionadaIcono(newValue : any){
    console.log(newValue)
    this.datosForm.patchValue({
      foto: newValue
    });
   }
  

  guardar(){

    this.submitted = true;
    
  
    this.datosForm.patchValue({
      vendedorId: this.authService.getUID() 
    });

    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    } 

    this.cliente.asignarValores(this.datosForm.value);

    if(this.updating){
      this.clientesService.update(this.cliente);
      this.modalController.dismiss({
        'item': this.cliente
      }); 
    }
    else{  
      this.clientesService.create(this.cliente).then(data=>{
        this.beneficiosService.activarBeneficioRegistro(this.cliente)
      });             
      this.modalController.dismiss({
        'item': this.cliente
      });        
    }   
  }

  cancelar(){
    if(this.campoModificado){
      this.gaurdarCambios();
    }
    else{
      this.modalController.dismiss()
    }     
  }

  elimiar(){
    this.presentAlertEliminar();
  }

  async presentAlertEliminar() {
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: 'Está seguro que desea eliminar el cliente?',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.clientesService.delete(this.cliente);
            this.modalController.dismiss();
         
          }
        }
      ]
    });
    await alert.present();
  }


  async gaurdarCambios() {
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: 'Está seguro que desea salir sin guardar los cambios?',
      buttons: [
        {
          text: 'No',
          handler: (blah) => {
            
          }
        }, {
          text: 'Si',
          handler: () => {
            this.modalController.dismiss();   
         
          }
        }
      ]
    });
    await alert.present();
  }

  async abrirDireccion(){
    this.router.navigate(['form-direccion']);
  }

  async seleccionarUbicacion(){

    if(this.cliente.direccion instanceof Localizacion){

    }
    else{
      this.cliente.direccion = new Localizacion()
    }

    const modal = await this.modalController.create({
      component: ModalInputDireccionPage,
      componentProps:{localizacion:this.cliente.direccion},
      cssClass:'modal-map'      
    });
    modal.onDidDismiss()
    .then((retorno) => {
      
      if(retorno.data){
        this.cliente.direccion = JSON.parse(JSON.stringify(retorno.data));
        console.log("!!!!!!!!!!")
      }
      console.log(this.cliente)
    });
    modal.present()
  }

  eliminarDireccion(){
    this.cliente.direccion = new Localizacion();
  }

}
