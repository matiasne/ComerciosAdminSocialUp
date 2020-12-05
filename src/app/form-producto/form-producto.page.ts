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
import { ProductosService } from '../Services/productos.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../models/producto';
import { FormCategoriaPage } from '../form-categoria/form-categoria.page';
import { LoadingService } from '../Services/loading.service';
import { GrupoOpcionesService } from '../Services/grupo-opciones.service';
import { Subscription } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { ToastService } from '../Services/toast.service';
import { FormProductoGrupoOpcionesPage } from '../form-producto-grupo-opciones/form-producto-grupo-opciones.page';
import { CocinasService } from '../Services/cocinas.service';

@Component({
  selector: 'app-form-producto',
  templateUrl: './form-producto.page.html',
  styleUrls: ['./form-producto.page.scss'],
})
export class FormProductoPage implements OnInit {

  isLoading = false;
  submitted = false;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 5
  };

  public categorias =[];
  public cocinas = [];

  public datosForm: FormGroup;
  
  public updating:boolean = false;
  public titulo = "Nuevo Producto";

  public producto:Producto;
  public croppedImageIcono ="";
  
  constructor(
    private formBuilder: FormBuilder,
    private imagePicker: ImagePicker,
    private camera: Camera,
    private crop: Crop,
    public actionSheetController: ActionSheetController,
    private file: File,
    public modalController: ModalController,
    public productosService:ProductosService,
    public categoriaService:CategoriasService,
    public dataService:DataService,
    private barcodeScanner: BarcodeScanner,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private navCtrl: NavController, 
    private loaadingService:LoadingService,
    private grupoOpcionesService:GrupoOpcionesService,
    private router:Router,
    private firestore: AngularFirestore,
    private toastServices:ToastService,
    private cocinasService:CocinasService
  ) { 
    this.producto = new Producto();

    this.datosForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      barcode:[''],
      destacado:[false],
      precio: ['', Validators.required],
      promocion:[''],
      unidad: ['unidades',Validators.required],
      valorPor:[1],
      stock: [1, Validators.required],
      descripcion:[''],
      cocina:['', Validators.required],
      categorias:[''],
      foto:[''],
      createdAt:[''],
      recibirPedidos:[true]
    });
  }

  get f() { return this.datosForm.controls; }

  ngOnInit() {
  }

  ionViewDidEnter(){

    if(this.route.snapshot.params.id){
      this.updating = true;
      this.productosService.get(this.route.snapshot.params.id).subscribe(data=>{           
        this.loaadingService.dismissLoading();
        this.titulo = "Editar Producto";
        this.datosForm.patchValue(data.payload.data());
        this.producto.asignarValores(data.payload.data())
        this.producto.id = data.payload.id;
        this.croppedImageIcono = this.producto.foto;       
      })
    }
    else{
      this.producto.id = this.firestore.createId();
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
    })

    this.cocinasService.setearPath();
    this.cocinasService.list().subscribe((data) => {     
      this.cocinas = data;
      if(this.cocinas.length == 0){
        this.presentAlertCrearCocinas();
      }
      console.log(this.categorias);
    })
  }

  ionViewDidLeave(){   

  }

  async openAddGrupoOpciones(){

    const modal = await this.modalController.create({
      component: FormProductoGrupoOpcionesPage,   
    });  

    modal.onDidDismiss().then((retorno) => {
      if(retorno.data){
        this.producto.gruposOpciones.push(retorno.data);
      }        
    });
    return await modal.present();

  }

  async editarGrupoOpciones(index,grupo){

    const modal = await this.modalController.create({
      component: FormProductoGrupoOpcionesPage, 
      componentProps:{
        grupo: grupo
      }  
    });  

    modal.onDidDismiss().then((retorno) => {
      if(retorno.data){

        if(retorno.data == "eliminar"){
          this.producto.gruposOpciones.splice(index,1);
        }
        else
          this.producto.gruposOpciones[index] = retorno.data;
      }        
    });
    return await modal.present();
  }

  guardar(){
    
    this.submitted = true;

    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    } 

    

    this.producto.asignarValores(this.datosForm.value);

    console.log(this.producto)

    var palabras = [this.datosForm.controls.nombre.value,this.datosForm.controls.descripcion.value];

    if(this.producto.categorias){
      if(this.producto.categorias.length > 0){
        this.producto.categorias.forEach(element => {
          palabras.push(element)
        });
      }
    }
    
  
   
    if(this.updating){
      this.productosService.update(this.producto);
    }
    else{
      this.productosService.create(this.producto);
    }

    this.navCtrl.back();

  }

  lectorDeCodigo(){
    this.barcodeScanner.scan().then(barcodeData => {   
      
      this.datosForm.patchValue({
        barcode: barcodeData.text,      
      });  

     }).catch(err => {
         alert(err);
     });
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

   imagenSeleccionadaIcono(newValue : any){
    console.log(newValue);
    this.datosForm.patchValue({
      foto: newValue
    })
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
      message: 'Está seguro que desea eliminar el producto?',
      buttons: [
        {
          text: 'Cancelar',
          handler: (blah) => {
            
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.productosService.delete(this.route.snapshot.params.id);
            this.navCtrl.back();
          }
        }
      ]
    });
    await alert.present();
  }


  async presentAlertCrearCocinas() {
    const alert = await this.alertController.create({
      header: 'Agregar Cocina',
      message: 'Debes agregar una cocina antes de continuar',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.router.navigate(['list-cocinas']);
          }
        }
      ]
    });
    await alert.present();
  }

}
