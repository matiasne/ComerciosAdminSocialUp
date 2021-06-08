import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, ActionSheetController, ModalController, AlertController, LoadingController, Platform, NavParams } from '@ionic/angular';
import { ComerciosService } from '../Services/comercios.service';
import { CajasService } from '../Services/cajas.service';
import { Subscription } from 'rxjs';
import { Comercio } from '../models/comercio';
import { LoadingService } from '../Services/loading.service';
import * as firebase from 'firebase/app';
import * as geofirex from 'geofirex';
import { ToastService } from '../Services/toast.service';
import { AuthenticationService } from '../Services/authentication.service';
import { RolesService } from '../Services/roles.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { FotoService } from '../Services/fotos.service';
import { ImagesService } from '../Services/images.service';
import { Archivo } from '../models/foto';
import { ModalInputDireccionPage } from '../modal-input-direccion/modal-input-direccion.page';
import { Localizacion } from '../models/localizacion';

@Component({
  selector: 'app-form-comercio',
  templateUrl: './form-comercio.page.html',
  styleUrls: ['./form-comercio.page.scss'],
})
export class FormComercioPage implements OnInit {


  datosForm: FormGroup;
  submitted = false;

  public cajas =[];
  public categorias =[];
  public horarios = [];

  public comercioId ="";

  public croppedImageIcono = "";

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 5
  };

  private subs: Subscription;
  public updating:boolean = false;

  public titulo="Nuevo Comercio";

  public comercio:Comercio;

  private isPortada=false;

  selectedFiles: FileList;
  _SUFFIX: any;
  public IsMobile = false;

  public iconChange = false;

  constructor(
    private formBuilder: FormBuilder,
    private comerciosService:ComerciosService,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController,
    public cajasService:CajasService,
    public alertController: AlertController,
    public loadingService:LoadingService,
    private modalCtrl:ModalController,
    private platform:Platform,
    private toastServices:ToastService,
    private authenticationService:AuthenticationService,
    private rolesService:RolesService,
    private navParams:NavParams,
    private firestore: AngularFirestore,
    private fotosService:FotoService,
    private imageService:ImagesService
  ) {

    this.comercio = new Comercio();
   

    this.datosForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      telefono:[''],
      icono:['_'],
      createdAt:[''],
      descripcion:['',Validators.required]
    });  
  }

  imagenSeleccionadaIcono(newValue : any){
    console.log(newValue);
    this.croppedImageIcono = newValue;
    this.iconChange = true;
  }

  ngOnInit() {
   
  }

  ionViewDidEnter(){
    
    if (this.platform.is('desktop')) {
      this.IsMobile = false;
    } else {
      this.IsMobile = true;
    } 

    if(this.navParams.get('comercio')){
      this.updating = true;
      this.datosForm.patchValue(this.navParams.get('comercio'));
      this.comercio.asignarValores(this.navParams.get('comercio'))
      this.titulo = "Editar Comercio";
      this.croppedImageIcono = this.comercio.icono.url;     
      this.horarios = this.comercio.horarios;     
      console.log(this.comercio)
    }      
  }

  ionViewDidLeave(){
    if(this.updating)
      this.subs.unsubscribe();
  }

  get f() { return this.datosForm.controls; }

  async guardar(){

    this.loadingService.presentLoading();
    this.submitted = true;   

    this.datosForm.patchValue({
      icono: this.croppedImageIcono
    });

    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    } 

    console.log(this.comercio)

    this.comercio.nombre = this.datosForm.controls.nombre.value;
    this.comercio.telefono = this.datosForm.controls.telefono.value;
    if(this.datosForm.controls.icono.value)
      this.comercio.icono = this.datosForm.controls.icono.value; 
    else
      this.comercio.icono ={
        url:""
      };
    this.comercio.descripcion = this.datosForm.controls.descripcion.value;
    

    var palabras = [this.datosForm.controls.nombre.value,this.datosForm.controls.descripcion.value];
    this.categorias.forEach(element => {     
        palabras.push(element.nombre)
    });
    
    console.log(this.comercio)

   
    if(this.updating == false){ 
      
      this.comercio.id = this.firestore.createId();
      this.rolesService.setUserAsAdmin(this.comercio.id);
      this.comerciosService.setPath("comercios");

    }

    if(this.iconChange){
      let blob = this.imageService.getBlob(this.croppedImageIcono)
      let file = await this.fotosService.uploadImagen(this.comercio.id,blob)
      let json = JSON.parse(JSON.stringify(file))
      this.comercio.icono = json    
    }

    this.comerciosService.set(this.comercio.id,this.comercio).then(async data=>{

      console.log("Comercio guardado")
      
      
    });
    this.loadingService.dismissLoading()
    this.modalCtrl.dismiss();
      
   
      
    

  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

  async seleccionarUbicacion(){
    if(this.comercio.direccion instanceof Localizacion){

    }
    else{
      this.comercio.direccion = new Localizacion()
    }
    const modal = await this.modalController.create({
      component: ModalInputDireccionPage,
      componentProps:{localizacion:this.comercio.direccion},
      cssClass:'modal-map'      
    });
    modal.onDidDismiss()
    .then((retorno) => {
      
      if(retorno.data){
        this.comercio.direccion = JSON.parse(JSON.stringify(retorno.data));
        console.log("!!!!!!!!!!")
      }
      console.log(this.comercio)
    });
    modal.present()
  }

  eliminarDireccion(){
    this.comercio.direccion = new Localizacion();
  }
}
