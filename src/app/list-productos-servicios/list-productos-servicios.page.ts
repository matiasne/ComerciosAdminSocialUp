import { Component, OnInit} from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from '../Services/productos.service';
import { Subscription } from 'rxjs';
import { ServiciosService } from '../Services/servicios.service';
import { AddProductoVentaPage } from '../add-producto-venta/add-producto-venta.page';
import { AddServicioSubscripcionPage } from '../add-servicio-subscripcion/add-servicio-subscripcion.page';
import { CarritoService } from '../Services/global/carrito.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ComerciosService } from '../Services/comercios.service';
import { LoadingService } from '../Services/loading.service';
import { CargaPorVozService } from '../Services/carga-por-voz.service';
import { ChangeDetectorRef } from '@angular/core'
import { ToastService } from '../Services/toast.service';
import { Carrito } from '../models/carrito';
import { CategoriasService } from '../Services/categorias.service';
import { FormProductoPage } from '../form-producto/form-producto.page';
import { FormStockPage } from '../form-stock/form-stock.page';
import { Comercio } from '../Models/comercio';

@Component({
  selector: 'app-list-productos-servicios',
  templateUrl: './list-productos-servicios.page.html',
  styleUrls: ['./list-productos-servicios.page.scss'],
})
export class ListProductosServiciosPage implements OnInit {

  slideOpts = {
    slidesPerView: 3,
    initialSlide: 2,
    speed: 400
  };

  comercio:Comercio;
  carrito:Carrito;
  itemsProductos:any = [];
  itemsServicios:any = [];
  itemsAllProductos:any=[];
  itemsAllServicios:any=[];
  public categorias =[];
  public subsItemsServ: Subscription;
  public subsItemsProd: Subscription;
  public subsComercio: Subscription;
  public carritoSubs:Subscription;
  public palabraFiltro = "";
  public ultimoItem = "";
  public loadingActive = false;
  public showProductos:boolean = true;
  public cajaSeleccionada="";
  public reconociendoPorVoz = false;
  public subsVoz:Subscription;

  public seteandoProducto = false;
  constructor(
    public loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    public productosService:ProductosService,
    public serviciosService:ServiciosService,
    public modalCtrl: ModalController,
    public carritoService:CarritoService,
    private barcodeScanner: BarcodeScanner,
    public alertController: AlertController,
    public comerciosService:ComerciosService,
    public loadingService:LoadingService,
    public cargaPorVoz:CargaPorVozService,
    public changeRef:ChangeDetectorRef,
    public toastServices:ToastService,
    private categoriasService:CategoriasService
  ) { 
    this.carrito = new Carrito("","");

   
  }

  ngOnInit() {
    
    this.itemsProductos = [];
    this.itemsServicios = [];
    this.comercio = new Comercio();

    this.comerciosService.getSelectedCommerce().subscribe(data=>{
      this.comercio.asignarValores(data);
    })

    this.cargaPorVoz.getPermission();
    this.carritoSubs = this.carritoService.getActualCarritoSubs().subscribe(data=>{
      this.carrito = data;
    });

    /*Mantener toda la lógica en el ngOninit para que solo se subscriba una vez y
    no demande al servidor todos los datso cda vez que se muestra esta pantalla*/
    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');
      var catSub = this.categoriasService.getAll(comercio_seleccionadoId).subscribe(snapshot =>{
        this.categorias = [];
        snapshot.forEach((snap: any) => {       
          var categoria = snap.payload.doc.data();
          categoria.id = snap.payload.doc.id; 
          categoria.seleccionado = false;
          this.categorias.push(categoria);           
        });    
        catSub.unsubscribe();
      })


    if(this.route.snapshot.params.filtro){
      this.palabraFiltro = this.route.snapshot.params.filtro;
      this.buscar();
    }
    this.obtenerTodo();
      
  }

  ionViewDidEnter(){
    this.marcarEnCarrito();
  }

  marcarEnCarrito(){
    this.itemsProductos.forEach(element => {
      element.enCarrito = 0;
    });
    this.carrito.productos.forEach(prod => {
      this.itemsProductos.forEach(element => {
        if(prod.id == element.id){
          console.log(element)
          element.enCarrito += prod.cantidad;
        }
      });
    })
  }

  ionViewDidLeave(){

  }

  buscar(){ 

    if(this.palabraFiltro != ""){

      var palabra = this.palabraFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      var encontrado = false;
      var retorno = false;

      this.itemsProductos = [];
      this.itemsServicios = [];
      
      this.itemsAllProductos.forEach(item => {      
  
        var palabra = this.palabraFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        var encontrado = false;
        if(item.nombre){
          retorno =  (item.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
          if(retorno)
            encontrado = true;
        }

        if(item.descripcion){
          retorno =  (item.descripcion.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
          if(retorno)
            encontrado = true;
        }

        if(item.barcode){
          if(item.barcode.includes(palabra)){
            this.itemsProductos.push(item);
            return;
          }            
        }
        
          
        if(item.categorias.length > 0){
          item.categorias.forEach(categoria => {
            retorno =  (categoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
            if(retorno){
              encontrado = true;  
            }              
          });
        }
  
        if(encontrado){
          this.itemsProductos.push(item);
          return true;
        }

      });

      if(this.cargaPorVoz.reconociendoPorVoz){
        if(this.itemsProductos.length > 0){
          this.seleccionar(this.itemsProductos[0]);
          this.toastServices.mensaje("Se seleccionó el producto: "+this.itemsProductos[0].nombre,"");
        }          
        else{
          this.toastServices.mensaje("No se encontró producto: "+this.palabraFiltro,"");
          this.reconocimientoPorVoz();
        }
      }

      
      this.itemsAllServicios.forEach(item => {
        var palabra = this.palabraFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        var encontrado = false;
        console.log(palabra)
        if(item.nombre){
          retorno =  (item.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
          if(retorno)
            encontrado = true;
        }

        if(item.descripcion){
          retorno =  (item.descripcion.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
          if(retorno)
            encontrado = true;
        }

        if(item.barcode){
          if(item.barcode.includes(palabra)){
            this.itemsProductos.push(item);
            return;
          }            
        }
        
          
        if(item.categorias.length > 0){
          item.categorias.forEach(categoria => {
            retorno =  (categoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
            if(retorno){
              encontrado = true;  
            }              
          });
        }
  
        if(encontrado){
          this.itemsServicios.push(item);
          return true;
        }
      });

        
      
    }
    else{
      this.itemsServicios = this.itemsAllServicios;
      this.itemsProductos = this.itemsAllProductos;
    }
    this.marcarEnCarrito();
  }

  editarProducto(item){
    this.loadingService.presentLoading();
    this.router.navigate(['form-producto',{id:item.id}]);
  }
    
  editarServicio(item){  
    this.loadingService.presentLoading();
    this.router.navigate(['form-servicio',{id:item.id}]);
  }


  obtenerTodo(){
     
    this.loadingService.presentLoading();
     
    this.subsItemsProd = this.productosService.getAll().subscribe((snapshotProd) => {
      this.itemsAllProductos =[];  
      this.loadingService.dismissLoading();
      
      snapshotProd.forEach((snapP: any) => {         
          var producto = snapP.payload.doc.data();
          producto.id = snapP.payload.doc.id;  
          producto.producto = true;
          producto.enCarrito = 0;
          this.itemsAllProductos.push(producto);         
      }); 
      this.buscar();    
      
    });


    
   

    this.loadingService.presentLoading();
      this.subsItemsServ = this.serviciosService.list().subscribe((snapshotServ) => {
        this.loadingService.dismissLoading();
        this.itemsAllServicios = [];
        snapshotServ.forEach((snaps: any) => {         
            var servicio = snaps;
            servicio.producto = false;
            this.itemsAllServicios.push(servicio);                 
        });  
        
       
        this.buscar();
      });
    
    

  }

  reconocimientoPorVoz(){

    if(!this.cargaPorVoz.reconociendoPorVoz){
      this.cargaPorVoz.reconociendoPorVoz = true;
      this.cargaPorVoz.startReconocimiento().subscribe(matches=>{

        this.toastServices.mensaje("Diga el nombre del producto","");
        let message = matches[0]; //Guarda la primera frase que ha interpretado en nuestra variable
     
        this.palabraFiltro = message;
        this.buscar();
        
      },
        (onerror) =>{
          if(onerror == 0){
            this.toastServices.mensaje("Reconocimiento por voz finalizado","");
            this.palabraFiltro = "";
            this.cargaPorVoz.reconociendoPorVoz = false;
          } 
          
        }
      ) 
    }else{
      this.cargaPorVoz.reconociendoPorVoz = false;
      this.cargaPorVoz.stopReconocimiento();
    }
    
  }

  seleccionar(item){
    
    if(this.comercio.modulos.cajas || this.comercio.modulos.comandas || this.comercio.modulos.mesas){
      if(item.producto){      
        this.agregarProducto(item);      
      }
      else{
        this.loadingService.presentLoading();
        this.agregarServicio(item);
      }
    }
    
  }

  nuevo(){    
    this.presentAlertSeleccionar()
  }


  async presentAlertSeleccionar() {

    if(this.comercio.modulos.productos && !this.comercio.modulos.servicios){
      this.nuevoProducto();   
    }

    if(!this.comercio.modulos.productos && this.comercio.modulos.servicios){
      this.nuevoServicio();
    }

    if(this.comercio.modulos.productos && this.comercio.modulos.servicios){
      const alert = await this.alertController.create({
        header: 'Agregar Elemento',
        message: 'Que tipo de elemento quieres agregar?',
        buttons: [
          {
            text: 'Producto',
            handler: (blah) => {
              this.nuevoProducto();     
            }
          }, {
            text: 'Servicio',
            handler: () => {
              this.nuevoServicio();
            }
          }
        ]
      });
      await alert.present();
    }
    
  }



  async presentLoading() {
    this.loadingActive = true;
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();
  }


  hideLoading(){
    if(this.loadingActive){
      this.loadingController.dismiss();
      this.loadingActive = false;
    }
  }

  lectorDeCodigo(){
    this.barcodeScanner.scan().then(barcodeData => {      
      //var codeBar:any =JSON.stringify(barcodeData);
      this.palabraFiltro = barcodeData.text;
      this.buscar();
     }).catch(err => {
         alert(err);
     });
  }

  

  irDashboardServicios(){
    this.router.navigate(['dashboard-servicios']);
  }

  irDashboardProductos(){
    this.router.navigate(['dashboard-productos']);
  }

  async agregarProducto(producto){
    
    const modal = await this.modalCtrl.create({
      component: AddProductoVentaPage,
      componentProps:{
        producto:producto
      }
    });  

    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){        
        this.carritoService.agregarProducto(retorno.data);  
        this.marcarEnCarrito();
      }
    });

    return await modal.present();
  }

  async agregarStock(producto){
    const modal = await this.modalCtrl.create({
      component: FormStockPage,
      componentProps:{
        producto:producto
      }
    });  

    return await modal.present();
  }

  agregarServicio(servicio){   
    this.router.navigate(['add-servicio-subscripcion',{
      id:servicio.id
    }]); 
  }

  verCarrito(){
    this.cargaPorVoz.reconociendoPorVoz = false;
    this.router.navigate(['details-carrito',{
      comanda:"true",
      cobro:"true",
      mesa:"true"
    }]);
  }

  verProductos(categoria){

    this.categorias.forEach(c =>{
      c.seleccionado = false;
    })
    
    if(categoria != ''){
      
      categoria.seleccionado = true;
      this.palabraFiltro = categoria.nombre.toLowerCase();
    }
    else{
      this.palabraFiltro = '';
    }
   
    this.buscar();
  }

  nuevoServicio(){
    this.router.navigate(['form-servicio']);
  }

  async nuevoProducto(){
    this.router.navigate(['form-producto']);
    /*let modal = await this.modalCtrl.create({
      component: FormProductoPage
    });

    return await modal.present();*/
    
  }
}
