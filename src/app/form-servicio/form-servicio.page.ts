import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { ActionSheetController, ModalController, AlertController, NavController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Camera, CameraOptions} from '@ionic-native/Camera/ngx';
import { FormPlanPage } from '../form-plan/form-plan.page';
import { ServiciosService } from '../Services/servicios.service';
import { CategoriasService } from '../Services/categorias.service';
import { DataService } from '../Services/data.service';
import { ActivatedRoute } from '@angular/router';
import { PlanesService } from '../Services/planes.service';
import { Servicio } from '../models/servicio';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription, Subscribable } from 'rxjs';
import { FormCategoriaPage } from '../form-categoria/form-categoria.page';
import { LoadingService } from '../Services/loading.service';
import { FormAddProfesionalPage } from '../form-add-profesional/form-add-profesional.page';
import { ToastService } from '../Services/toast.service';
import { FormCalendarioPage } from '../form-calendario/form-calendario.page';
import { CalendariosService } from '../Services/calendarios.service';


@Component({
  selector: 'app-form-servicio',
  templateUrl: './form-servicio.page.html',
  styleUrls: ['./form-servicio.page.scss'],
})
export class FormServicioPage implements OnInit {

  croppedImagepath = "";
  isLoading = false;
  submitted = false;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 5
  };

  public planes = [];
  public categorias =[];
  public calendarios = [];

  public datosForm: FormGroup;
  
  public updating:boolean = false;

  public titulo = "Nuevo Servicio";

  public servicio:Servicio;

  public planesSubs:Subscription;
  public subs:Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private imagePicker: ImagePicker,
    private camera: Camera,
    private crop: Crop,
    public actionSheetController: ActionSheetController,
    private file: File,
    public modalController: ModalController,
    public serviciosService:ServiciosService,
    public categoriaService:CategoriasService,
    public dataService:DataService,    
    private route: ActivatedRoute,
    public alertController: AlertController,
    private navCtrl: NavController,
    public planesServices:PlanesService,
    private firestore: AngularFirestore,
    private loadingService:LoadingService,
    private toastServices:ToastService,
    private calendariosServices:CalendariosService
  ) { 

    this.servicio = new Servicio();

    this.datosForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion:[''],
      categorias:['',Validators.required],
      foto:[''],
      createdAt:[''],
      recibirReservas:[false],
      recibirSubscripciones:[false]
    });

    if(this.route.snapshot.params.id){
      
      this.updating = true;
      this.titulo = "Editar Servicio";
      this.subs = this.serviciosService.get(this.route.snapshot.params.id).subscribe(resp=>{
        this.loadingService.dismissLoading();
        this.datosForm.patchValue(resp)
        this.servicio.asignarValores(resp);        
        this.obtnerPlanes();
        this.obtnerCalendarios();

      });
    }
    else{
    //  this.servicio.id = this.firestore.createId();
    //  this.obtnerPlanes();
    //  this.obtnerCalendarios();
    }

    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    
    this.categoriaService.getAll(comercio_seleccionadoId).subscribe((snapshot) => {
      
      this.categorias = [];
      snapshot.forEach((snap: any) => {         
        var item = snap.payload.doc.data();
        item.id = snap.payload.doc.id;        
        this.categorias.push(item);   
           
      });
      console.log(this.categorias);
      this.loadingService.dismissLoading();
    })
    //obtener categorias del backend

  }

  obtnerPlanes(){
    this.loadingService.presentLoading();
    this.planesSubs = this.planesServices.getAll(this.servicio.id).subscribe(snapshot=>{                 
      this.planes = [];
      this.loadingService.dismissLoading();
      snapshot.forEach((snap: any) => {           
          var item = snap.payload.doc.data();
          item.id = snap.payload.doc.id;              
          this.planes.push(item);             
      });
    });
  }

  obtnerCalendarios(){
    this.loadingService.presentLoading();   
    this.calendariosServices.setPathIds(this.servicio.id); 
    this.planesSubs = this.calendariosServices.list().subscribe(items=>{                 
      this.calendarios = items;
      this.loadingService.dismissLoading();
    });
  }

  ionViewDidLeave(){
 
  }

  get f() { return this.datosForm.controls; }

  ngOnInit() {
  }

  guardar(){
    this.submitted = true;
    
    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    }   
    
    this.servicio.asignarValores(this.datosForm.value);
    if(this.updating){
      const serv = JSON.parse(JSON.stringify(this.servicio));
      this.serviciosService.update(serv).then((data:any)=>{
        console.log(data.id);
        this.planes.forEach(plan =>{
          plan.servicioId = data.id;
          this.planesServices.create(plan).then(data=>{
            console.log(data);
          })          
        })
        console.log(this.calendarios)
        this.calendarios.forEach(calendario =>{
          calendario.servicioId = data.id;
          this.calendariosServices.set(calendario).then(data=>{
            console.log(data);
          })
        })
      });
    }
    else{
      const serv = JSON.parse(JSON.stringify(this.servicio));
      this.serviciosService.add(serv).then((data:any)=>{
        console.log(data.id);
        this.planes.forEach(plan =>{
          plan.servicioId = data.id;
          this.planesServices.create(plan).then(data=>{
            console.log(data);
          })
        })
        this.calendarios.forEach(calendarios =>{
          calendarios.servicioId = data.id;
          this.calendariosServices.set(calendarios).then(data=>{
            console.log(data);
          })
        })
      })
      .catch(err=>{
        console.log(err);
      });
    } 

    this.navCtrl.back();
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Seleccionar de la Galería',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Sacar Foto',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  pickImage(sourceType) {

    console.log(sourceType);

    if(sourceType == 0){
      this.imagePicker.getPictures(this.imagePickerOptions).then((results) => {
        for (var i = 0; i < results.length; i++) {
          this.cropImage(results[i]);          
        }
      }, (err) => {
        alert(err);
      });
    }

    if(sourceType == 1){
      const options: CameraOptions = {
        quality: 5,
        sourceType: sourceType,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true
      }
      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        // let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.cropImage(imageData)
      }, (err) => {
        // Handle error
      });
    }
    
  }

  cropImage(fileUrl) {
    this.crop.crop(fileUrl, { quality: 5, targetHeight:0, targetWidth:0 })
      .then(
        newPath => {
          this.showCroppedImage(newPath.split('?')[0])
        },
        error => {
          alert('Error cropping image' + error);
        }
      );
  }

  showCroppedImage(ImagePath) {
    this.isLoading = true;
    var copyPath = ImagePath;
    var splitPath = copyPath.split('/');
    var imageName = splitPath[splitPath.length - 1];
    var filePath = ImagePath.split(imageName)[0];

    this.file.readAsDataURL(filePath, imageName).then(base64 => {
      this.croppedImagepath = base64;
      this.datosForm.patchValue({
        foto: this.croppedImagepath
      })
      this.isLoading = false;
    }, error => {
      alert('Error in showing image' + error);
      this.isLoading = false;
    });
  }

  async openNewPlan(){    
    const modal = await this.modalController.create({
      component: FormPlanPage,
      componentProps: { servicioId: this.servicio.id}
    });

    modal.onDidDismiss().then((retorno) => {
      if(retorno.data){
        this.planes.push(retorno.data);
      }        
    });

    return await modal.present();
  }

  async editarPlan(plan,index){
    const modal = await this.modalController.create({
      component: FormPlanPage,
      componentProps: { plan: plan }
    });

    modal.onDidDismiss().then((retorno) => {
      if(retorno.data == 'eliminar'){
        this.planesServices.delete(this.planes[index]);        
      }

      if(retorno.data){
        this.planes[index] = retorno.data;
        console.log(this.planes);        
      }  
    });

    return await modal.present();
  }

  async openNewCalendario(){
    const modal = await this.modalController.create({
      component: FormCalendarioPage,
      componentProps: { servicioId: this.servicio.id}
    });
    modal.onDidDismiss().then((retorno) => {
      if(retorno.data){
        this.calendarios.push(retorno.data);
      }        
    });
    return await modal.present();
  }

  async editarCalendario(calendario,index){
    const modal = await this.modalController.create({
      component: FormCalendarioPage,
      componentProps: { 
        calendario: calendario,
        servicioId: this.servicio.id
      }
    });
    modal.onDidDismiss().then((retorno) => {

      if(retorno.data == 'eliminar'){
        this.calendariosServices.delete(this.calendarios[index].id);  
      }

      if(retorno.data){
        this.calendarios[index] = retorno.data;
        console.log(this.planes);        
      } 
      
      
      
    });
    return await modal.present();
  }

  

  async openAgregarProfesional(){
    const modal = await this.modalController.create({
      component: FormAddProfesionalPage,
    });
    await modal.present();

    modal.onDidDismiss()
    .then((retorno) => {
      console.log(retorno.data)
      if(retorno.data)
        this.servicio.profesionales.push(retorno.data);        
    });
    return await modal.present();
  }

  async editarProfesional(index,profesional){
    const modal = await this.modalController.create({
      component: FormAddProfesionalPage,
      componentProps: { profesional: profesional }
    });
    await modal.present();

    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){
        if(retorno.data == "eliminar"){
          this.servicio.profesionales.splice(index,1);
        }
        this.servicio.profesionales[index] = retorno.data;    
      }
            
    });
    return await modal.present();

  }

  cancelar(){
    this.navCtrl.back();
  }

  elimiar(){
    this.presentAlertEliminar();
  }

  async openAddCategoria(){
    const modal = await this.modalController.create({
      component: FormCategoriaPage,  
      componentProps: { 
        comercioId:localStorage.getItem('comercio_seleccionadoId')
      }
    });  
    return await modal.present();
  }

  async presentAlertEliminar() {
    const alert = await this.alertController.create({
      header: 'Eliminar',
      message: 'Está seguro que desea eliminar el servicio?',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.serviciosService.delete(this.route.snapshot.params.id);
            this.navCtrl.back();
          }
        }
      ]
    });
    await alert.present();
  }
  

}
