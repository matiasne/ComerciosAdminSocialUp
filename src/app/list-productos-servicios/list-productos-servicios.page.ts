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
import { AuthenticationService } from '../Services/authentication.service';
import { VariacionesStocksService } from '../Services/variaciones-stocks.service';
import { DetailsCarritoPage } from '../details-carrito/details-carrito.page';

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

  public itemsSeparadosAlfabeticamente = [];

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

  public permisos = {
    canAgregar:false,
    canCarrito:false,
  }

  constructor(
    public loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    public productosService:ProductosService,
    public variacionesStockService:VariacionesStocksService,
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
    private categoriasService:CategoriasService,
    private AuthenticationService:AuthenticationService,
    
  ) { 
    this.carrito = new Carrito("","");

    this.AuthenticationService.observeRol().subscribe(data=>{
      if(data=="Administrador"){
        this.permisos.canAgregar = true;
        this.permisos.canCarrito = true;
      }
      if(data=="Cajero"){
        this.permisos.canAgregar = false;
        this.permisos.canCarrito = true;
      }
    })
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
      this.buscar(undefined);
      this.deseleccionarCategorias()
    }
    this.obtenerTodo();
      
  }

  ionViewDidEnter(){
    this.marcarEnCarrito();
  }

  ionViewDidLeave(){
    this.subsItemsProd.unsubscribe();
  }

  marcarEnCarrito(){
    console.log("scando marcado en carrito")
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


  buscar(event){ 

    if(event)
      this.palabraFiltro = event.target.value;    
    

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

      console.log("buscando...."+this.palabraFiltro+" "+this.cargaPorVoz.reconociendoPorVoz)
      if(this.cargaPorVoz.reconociendoPorVoz){
        this.cargaPorVoz.reconociendoPorVoz = false;
        if(this.itemsProductos.length == 1){
          this.seleccionar(this.itemsProductos[0]);
          this.toastServices.mensaje("Se seleccionó el producto: "+this.itemsProductos[0].nombre,"");
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

    this.itemsSeparadosAlfabeticamente = []
    let data = this.itemsProductos.reduce((r, e) => {
      // get first letter of name of current element
      let group = e.nombre[0];
      // if there is no property in accumulator with this letter create it
      if(!r[group]) r[group] = {group, children: [e]}
      // if there is push current element to children array for that letter
      else r[group].children.push(e);
      // return accumulator
      return r; 
    }, {}); 

    this.itemsSeparadosAlfabeticamente = Object.values(data)

    console.log(this.itemsSeparadosAlfabeticamente)

    this.marcarEnCarrito();
    this.changeRef.detectChanges()
    
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
      console.log("!!!!!")
      snapshotProd.forEach((snapP: any) => {         
          var producto = snapP.payload.doc.data();
          producto.id = snapP.payload.doc.id;  
          producto.producto = true;
          producto.enCarrito = 0;
          this.itemsAllProductos.push(producto);         
      }); 
      this.buscar(undefined);   
      
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
        
       
        this.buscar(undefined);
      });
    
    

  }

  reconocimientoPorVoz(){

    if(!this.cargaPorVoz.reconociendoPorVoz){
      this.cargaPorVoz.reconociendoPorVoz = true;
      this.cargaPorVoz.startReconocimiento().subscribe(matches=>{        
          let message = matches[0]; //Guarda la primera frase que ha interpretado en nuestra variable     
          this.palabraFiltro = message;
           this.buscar(undefined);        
        },
        (onerror) =>{
            if(onerror == 0){
              this.toastServices.mensaje("Reconocimiento por voz finalizado","");
              this.palabraFiltro = "";
               this.buscar(undefined);
            } 
        }) 
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
    let user = this.AuthenticationService.getActualUser();

  /*  if(user.maxProducto){ //Esto como estrategia de marketing no sirve. mejor dejar cargar mucho y limitar a 7 días
      if((this.itemsAllProductos.length + this.itemsAllServicios.length)  >= user.maxProducto){
        this.toastServices.alert("Limitado","Se ha superado la cantidad máxima de productos, si desea agregar más por favor contrate un plan mayor.")
        return;
      }
    }
    else{
      user.maxProducto = 10;
      if((this.itemsAllProductos.length + this.itemsAllServicios.length) > 0){
        this.toastServices.alert("Limitado","Se ha superado la cantidad máxima de productos, si desea agregar más por favor contrate un plan mayor.")
        return;
      } 
    }*/ 

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
      
     }).catch(err => {
    
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
      this.loadingService.presentLoading();
      if(retorno.data){ 
        retorno.data.keywords = []       
        this.carritoService.agregarProducto(retorno.data);  
        this.marcarEnCarrito();
       
      }
      this.deseleccionarCategorias()
      this.palabraFiltro ="";
      this.buscar(undefined);
      this.loadingService.dismissLoading();
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

  async verCarrito(){
    this.cargaPorVoz.reconociendoPorVoz = false;

    const modal = await this.modalCtrl.create({
      component: DetailsCarritoPage,
      componentProps: {
        rol:"encargado"      
      }
    });
    modal.onDidDismiss()
    .then((retorno) => {
      this.marcarEnCarrito()
      this.palabraFiltro ="";
      this.buscar(undefined);  
      this.deseleccionarCategorias()  
    });
    return await modal.present();

  }

  verProductos(categoria){

    this.palabraFiltro = categoria.nombre.toLowerCase();
    this.buscar(undefined);

   this.deseleccionarCategorias();
    
    if(categoria != ''){      
      categoria.seleccionado = true;     
    }
    else{
      this.palabraFiltro = '';
    }    
  }

  deseleccionarCategorias(){
    this.categorias.forEach(c =>{
      c.seleccionado = false;
    })
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
