import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { ActionSheetController, ModalController, AlertController, NavController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Camera} from '@ionic-native/camera/ngx';
import { CategoriasService } from '../Services/categorias.service';
import { ProductosService } from '../Services/productos.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../models/producto';
import { FormCategoriaPage } from '../form-categoria/form-categoria.page';
import { AngularFirestore } from 'angularfire2/firestore';
import { ToastService } from '../Services/toast.service';
import { FormProductoGrupoOpcionesPage } from '../form-producto-grupo-opciones/form-producto-grupo-opciones.page';
import { CocinasService } from '../Services/cocinas.service';
import { SelectGruposOpcionesPage } from '../select-grupos-opciones/select-grupos-opciones.page';
import { GrupoOpcionesService } from '../Services/grupo-opciones.service';
import { FotoService } from '../Services/fotos.service';
import { ComerciosService } from '../Services/comercios.service';
import { ImagesService } from '../Services/images.service';
import { Archivo } from '../models/foto';
import { FormStockPage } from '../form-stock/form-stock.page';
import { Comercio } from '../models/comercio';
import { DetailsImagePage } from '../details-image/details-image.page';
import { WoocommerceService } from '../Services/woocommerce/woocommerce.service';
import { LoadingService } from '../Services/loading.service';
import { WoocommerceSyncData } from '../models/woocommerceSyncData';

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

  slideOpts = {
    slidesPerView: 2,
    initialSlide: 2,
    speed: 400
  };

  public categorias =[];
  public cocinas = [];
  public gruposOpciones = [];

  public datosForm: FormGroup;
  
  public updating:boolean = false;
  public titulo = "Nuevo Producto";

  public producto:Producto; 
  public croppedImageIcono ="";

  public imagenesNuevas = []

  public comercio:Comercio

  public flagWoocommerce = false
  public woocommerceSyncData:WoocommerceSyncData
  
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
    private barcodeScanner: BarcodeScanner,
    private route: ActivatedRoute,
    public alertController: AlertController,
    private navCtrl: NavController, 
    private router:Router,
    private firestore: AngularFirestore,
    private toastServices:ToastService,
    private cocinasService:CocinasService,
    public changeRef:ChangeDetectorRef,
    public gruposOpcionesService:GrupoOpcionesService,
    public fotosService:FotoService,
    public comercioService:ComerciosService,
    public imageService:ImagesService,
    private modalCtrl:ModalController,
    private loadingService:LoadingService
  ) { 

    this.comercio = new Comercio()
    this.comercio.asignarValores(this.comercioService.getSelectedCommerceValue())
    this.producto = new Producto();
    this.woocommerceSyncData = new WoocommerceSyncData()  

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
      cocinaId:[''],
      categorias:[''],
      foto:[''],
      createdAt:[''],
      recibirPedidos:[true]
    });
  }

  get f() { return this.datosForm.controls; }

  ngOnInit() {
  }

  async ionViewDidEnter(){

    this.loadingService.dismissLoading()

    if(this.route.snapshot.params.id){
      this.updating = true; 

      this.productosService.get(this.route.snapshot.params.id).subscribe(producto=>{        
        this.titulo = "Editar Producto";
        this.datosForm.patchValue(producto);
        this.producto.asignarValores(producto)

        this.gruposOpciones = []; 
        this.producto.gruposOpcionesId.forEach(id =>{
          let sub = this.gruposOpcionesService.get(id).subscribe(data=>{
            this.gruposOpciones.push(data);
            sub.unsubscribe()
          })
        })      
        this.changeRef.detectChanges()        
      })    
      
      this.productosService.getWoocommerceValue(this.route.snapshot.params.id).subscribe(data=>{
        this.woocommerceSyncData.asignarValores(data);
        console.log(data)
      })
    } 
    else{
      this.producto.id = this.firestore.createId();
    }

    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    this.categoriaService.getAll().subscribe((snapshot) => {     
      this.categorias = [];
      snapshot.forEach((snap: any) => {         
          var item = snap.payload.doc.data();
          item.id = snap.payload.doc.id;              
          this.categorias.push(item);   
      }); 
    })

    this.cocinasService.list().subscribe((data) => {     
      this.cocinas = data;
      if(this.cocinas.length == 0){
        this.presentAlertCrearCocinas();
      }
    })

   

  }


  ionViewDidLeave(){   

  }

  
  addFoto(newValue : any){   
    let archivo = new Archivo();
    archivo.url = newValue;    
    this.imagenesNuevas.push(archivo);
  }

  async agregarFoto(blob){
    return this.fotosService.uploadImagen(this.producto.id,blob)
  }

  async eliminarFoto(index){

    const alert = await this.alertController.create({
      header: 'Está seguro que desea eliminar esta imagen?',
      message: '',
      buttons: [
        { 
          text: 'No',
          handler: (blah) => {
            
          }
        }, {
          text: 'Si',
          handler: () => {           
           
           
           this.producto.imagenes.splice(index,1)      
          }
        }
      ]
    });
    await alert.present();    

  }

  async verImagen(index,imagen){
    const modal = await this.modalCtrl.create({
      component: DetailsImagePage,
      componentProps: {
        url:imagen.url      
      }
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data == "eliminar"){     
        this.eliminarFoto(index)
      }        
    });
    return await modal.present();
  }

  async verImagenNueva(index,imagen){
    const modal = await this.modalCtrl.create({
      component: DetailsImagePage,
      componentProps: {
        url:imagen.url      
      }
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data == "eliminar"){     
        this.eliminarFotoNueva(index)
      }        
    });
    return await modal.present();
  }

  async eliminarFotoNueva(index){

    const alert = await this.alertController.create({
      header: 'Está seguro que desea eliminar esta imagen?',
      message: '',
      buttons: [
        { 
          text: 'No',
          handler: (blah) => {
            
          }
        }, {
          text: 'Si',
          handler: () => {           
           
            this.imagenesNuevas.splice(index,1)            
          }
        }
      ]
    });
    await alert.present();    
  }


  async openAddGrupoOpciones(){   
      const modal = await this.modalController.create({
        component: SelectGruposOpcionesPage      
      });  
      modal.present().then(()=>{
        
      })
  
      modal.onDidDismiss()
      .then((retorno) => {
        if(retorno.data){
          this.gruposOpciones.push(retorno.data.item);
        }        
      });
      return await modal.present();
    }


  

  async eliminarGrupoOpciones(index){
    this.gruposOpciones.splice(index,1);
  }

  async guardar(){
    
    this.submitted = true;
    

    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return; 
    }  


    this.producto.gruposOpcionesId =[]
    this.gruposOpciones.forEach(grupo =>{
      this.producto.gruposOpcionesId.push(grupo.id);
    })

    this.producto.asignarValores(this.datosForm.value);

    var palabras = [this.datosForm.controls.nombre.value,this.datosForm.controls.descripcion.value];

    if(this.producto.categorias){
      if(this.producto.categorias.length > 0){
        this.producto.categorias.forEach(element => {
          palabras.push(element)
        });
      }
    } 

    //Pasamos imagenes nuevas
    for(let i=0;i<this.imagenesNuevas.length;i++){     
      let blob = this.imageService.getBlob(this.imagenesNuevas[i].url)
      let file = await this.agregarFoto(blob)
      let json = JSON.parse(JSON.stringify(file))
      this.producto.imagenes.push(json)     
    }

    if(this.comercio.config.woocommerce){
      
      console.log(this.woocommerceSyncData)
      this.woocommerceSyncData.changeDate = new Date()
      let wSyncData = JSON.parse(JSON.stringify(this.woocommerceSyncData));
      this.productosService.updateWoocommerceValues(this.producto.id,wSyncData);
    }

   
    if(this.updating){
      this.productosService.update(this.producto).then((data:any)=>{
        
      })
     
    } 
    else{
      this.productosService.set(this.producto.id,this.producto).then((data:any)=>{
      })
      
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

  async agregarStock(){
    const modal = await this.modalCtrl.create({
      component: FormStockPage,
      componentProps:{
        producto:this.producto
      }
    });  

    return await modal.present();
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
            this.productosService.deleteWoocommerceValues(this.route.snapshot.params.id)
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
