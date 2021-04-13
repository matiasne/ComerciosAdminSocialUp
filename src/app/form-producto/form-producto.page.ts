import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { ActionSheetController, ModalController, AlertController, NavController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Camera} from '@ionic-native/Camera/ngx';
import { CategoriasService } from '../Services/categorias.service';
import { DataService } from '../Services/data.service';
import { ProductosService } from '../Services/productos.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../models/producto';
import { FormCategoriaPage } from '../form-categoria/form-categoria.page';
import { LoadingService } from '../Services/loading.service';
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

  public fotos = []
  
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
    private router:Router,
    private firestore: AngularFirestore,
    private toastServices:ToastService,
    private cocinasService:CocinasService,
    public changeRef:ChangeDetectorRef,
    public gruposOpcionesService:GrupoOpcionesService,
    public fotosService:FotoService,
    public comercioService:ComerciosService,
    public imageService:ImagesService
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
      cocinaId:['', Validators.required],
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
        this.datosForm.patchValue(data.data());
        this.producto.asignarValores(data.data())
        this.producto.id = data.id;
        this.croppedImageIcono = this.producto.fotoPrincipal;

        this.gruposOpciones = []; 
        this.producto.gruposOpcionesId.forEach(id =>{
          let sub = this.gruposOpcionesService.get(id).subscribe(data=>{
            console.log(data)
            this.gruposOpciones.push(data);
            sub.unsubscribe()
          })
        })      
        this.changeRef.detectChanges()        
      })
      this.obtenerFotos(this.route.snapshot.params.id);
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

  obtenerFotos(productoId){  
    this.fotos = [];
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
    this.fotosService.setPathFoto("comercios/"+comercio_seleccionadoId+"/productos",productoId)
    let obs = this.fotosService.list().subscribe(data=>{
      this.fotos = data;
      console.log(this.fotos) 
      obs.unsubscribe();
    })
  }

  ionViewDidLeave(){   

  }

  
  addFoto(newValue : any){   
    console.log(newValue);
    let archivo = new Archivo();
    archivo.url = newValue;
    this.fotos.push(archivo);
  }

  agregarFoto(blob,principal){
    this.fotosService.cargarFotoAElemeto("comercios/"+this.comercioService.getSelectedCommerceValue().id+"/productos",this.producto.id,blob,principal)
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
            if(this.fotos[index].id){
              let foto = this.fotos[index]
              this.fotosService.deleteArchivo(foto,foto.id)
            }
            this.fotos.splice(index,1)            
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
    console.log(index)
    this.gruposOpciones.splice(index,1);
  }

  guardar(){
    
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

    this.fotos.forEach(foto=>{
      if(!foto.id){
        let blob = this.imageService.getBlob(foto.url)
        this.agregarFoto(blob,foto.principal)
      }     
    })

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
    this.producto.fotoPrincipal = newValue
    this.datosForm.patchValue({
      foto: newValue
    })
   } 

   fotoPrincipal(index){
     console.log(this.fotos[index].url)
     this.producto.fotoPrincipal = this.fotos[index].url
     this.datosForm.patchValue({
      foto: this.fotos[index].url
    }) 
   }

 
  cancelar(){
    if(this.updating == false){ //si se cancela entonces hay que borrar las fotos guardadas 
      this.fotos.forEach(foto =>{
        this.fotosService.deleteArchivo(foto,foto.id);
      })
    }
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
