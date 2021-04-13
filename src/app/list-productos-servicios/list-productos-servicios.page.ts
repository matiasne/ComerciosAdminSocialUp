import { Component, OnInit} from '@angular/core';
import { ModalController, LoadingController, AlertController, NavController, Platform } from '@ionic/angular';
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
import { Comercio } from '../models/comercio';
import { AuthenticationService } from '../Services/authentication.service';
import { VariacionesStocksService } from '../Services/variaciones-stocks.service';
import { DetailsCarritoPage } from '../details-carrito/details-carrito.page';
import { FormDescuentoPage } from '../form-descuento/form-descuento.page';
import { FormRecargoPage } from '../form-recargo/form-recargo.page';
import { Pedido } from '../models/pedido';
import { DetailsPedidoPage } from '../details-pedido/details-pedido.page';
import { ComandaPage } from '../impresiones/comanda/comanda.page';
import { ImpresoraService } from '../Services/impresora.service';
import { EnumPlanes, User } from '../models/user';
import { CambiarPlanPage } from '../cambiar-plan/cambiar-plan.page';
import { PedidoService } from '../Services/pedido.service';
import { NavegacionParametrosService } from '../Services/global/navegacion-parametros.service';


@Component({
  selector: 'app-list-productos-servicios',
  templateUrl: './list-productos-servicios.page.html',
  styleUrls: ['./list-productos-servicios.page.scss'],
})
export class ListProductosServiciosPage implements OnInit {

  /*slideOpts = {
    slidesPerView: 3,
    initialSlide: 2,
    speed: 400
  };*/

  comercio:Comercio;
  carrito:Carrito;
  itemsAllProductos:any=[];
  itemsProductos:any = [];
  

  public itemsSeparadosAlfabeticamente = [];

  public categorias =[];
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

  public buscandoProductos = true;

  public buscandoBarCode = false;

  public isMobile = false;

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
    private modalController:ModalController,
    private authenticationService:AuthenticationService,
    private navParametrosService:NavegacionParametrosService,
    private platform:Platform
    
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

    if (this.platform.is('mobile')) { 
      this.isMobile = true;
    }     
  }

  
  refresh(event) {
    console.log('Begin async operation');
    this.ngOnInit();
    setTimeout(() => {
        event.target.complete();
      }, 500);
  }


  ngOnInit() {
    
    this.itemsProductos = [];
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
      this.deseleccionarCategorias()
    }
    this.obtenerTodo();      
  }
 
  ionViewDidEnter(){
    this.marcarEnCarrito();
  }

  ionViewDidLeave(){
    //this.subsItemsProd.unsubscribe();
  }

  marcarEnCarrito(){
    this.itemsProductos.forEach(element => {
      element.enCarrito = 0;
    }); 
    this.carrito.productos.forEach(prod => {
      this.itemsProductos.forEach(element => {
        if(prod.id == element.id){
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

      var retorno = false;

      this.itemsProductos = [];
      
      this.itemsAllProductos.forEach(item => {      
  
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
            //this.itemsProductos.push(item);
            //return;
            encontrado = true;
          }            
        }
        
  
        if(encontrado){
          this.itemsProductos.push(item);
          return true;
        }
      });

      if(this.buscandoBarCode){
        this.buscandoBarCode = false;
        if(this.itemsProductos.length == 1){
          this.agregarProducto(this.itemsProductos[0])
          this.toastServices.mensaje("Se seleccionó el producto: "+this.itemsProductos[0].nombre,"");
        }
      }

      
      if(this.cargaPorVoz.reconociendoPorVoz){
        this.cargaPorVoz.reconociendoPorVoz = false;
        if(this.itemsProductos.length == 1){
          this.agregarProducto(this.itemsProductos[0]);
          this.toastServices.mensaje("Se seleccionó el producto: "+this.itemsProductos[0].nombre,"");
        }
      }           
      
    }
    else{      
      this.itemsProductos = this.itemsAllProductos;
    }    
    this.changeRef.detectChanges()    
  }

  editarProducto(item){
    this.loadingService.presentLoading();
    this.router.navigate(['form-producto',{id:item.id}]);
  }

  show(){

  }

  showMore(){

  }
    

  obtenerTodo(){
     
    this.buscandoProductos = true;
    this.subsItemsProd = this.productosService.getAll().subscribe((snapshotProd) => {
      this.itemsAllProductos =[];  
      this.buscandoProductos = false;
      snapshotProd.forEach((snapP: any) => {         
          var producto = snapP.payload.doc.data();
          producto.id = snapP.payload.doc.id;  
          producto.producto = true;
          producto.enCarrito = 0;
          this.itemsAllProductos.push(producto);         
      }); 
      this.buscar(undefined);   
      
    });   

  }

  vaciarCarrito(){
    this.carritoService.vaciar()
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


  lectorDeCodigo(){
    this.buscandoBarCode = true;
    this.barcodeScanner.scan().then(barcodeData => {      
      //var codeBar:any =JSON.stringify(barcodeData);
      this.palabraFiltro = barcodeData.text;
      this.buscar(undefined)
     }).catch(err => {
    
     });
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

      this.palabraFiltro ="";    
      this.loadingService.presentLoading()
      setTimeout(()=>{ 
        this.loadingService.dismissLoading()
      }, 200);
      

      if(retorno.data){   
        
                 
        this.marcarEnCarrito();    
      }else{

      }     


    });

    await modal.present();
  }

  async agregarDescuento(){
    
    const modal = await this.modalCtrl.create({
      component: FormDescuentoPage
    });  

    return await modal.present();
  }

  async agregarRecargo(){
    const modal = await this.modalCtrl.create({
      component: FormRecargoPage
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

  async siguiente(){    //recordar que el modulo de mesas funciona a través de los pedidos y necesitamos generar el paso intermedio
    if(this.comercio.modulos.pedidos == true || this.comercio.modulos.mesas){
      this.verCarrito();
    }
    else{
      this.cobrarDirectamente()
    }
  }

  async verCarrito(){
    this.router.navigate(['details-carrito'])  
  }

  async cobrarDirectamente(){

    let pedido = new Pedido()
    this.carrito.productos.forEach(p=>{
      pedido.productos.push(Object.assign({}, p))
    })  

    this.carrito.descuentos.forEach(p=>{
      pedido.descuentos.push(Object.assign({}, p))
    }) 

    this.carrito.recargos.forEach(p=>{
      pedido.recargos.push(Object.assign({}, p))
    }) 

    pedido.personalId = this.authenticationService.getUID();
    pedido.personalEmail = this.authenticationService.getEmail();
    pedido.personalNombre = this.authenticationService.getNombre();
    
    pedido.clienteId = this.carrito.cliente.id;
    pedido.clienteNombre = this.carrito.cliente.nombre;
    pedido.clienteEmail = this.carrito.cliente.email;

    pedido.mesaId = this.carrito.mesa.id;
    pedido.mesaNombre = this.carrito.mesa.nombre;
    pedido.totalProductos = this.carrito.totalProductos; 

    let editarPedido = new Pedido();
    editarPedido.asignarValores(pedido);
    
    this.navParametrosService.param = editarPedido;
    this.router.navigate(['details-pedido'])

  }

  async imprimirComanda(pedido){
    const modal = await this.modalController.create({
      component: ComandaPage,
      componentProps:{
        pedido:pedido,
      }      
    });    
    return await modal.present();
  }


  verProductos(categoria){

    if(categoria!= '')
      this.palabraFiltro = categoria.nombre.toLowerCase();
    else
      this.palabraFiltro = "";
   

   this.deseleccionarCategorias();
    
    if(categoria != ''){      
      categoria.seleccionado = true;     
    }
    else{
      this.palabraFiltro = '';
    }    
  }

  deseleccionarCategorias(){
    /*this.categorias.forEach(c =>{
      c.seleccionado = false;
    })*/
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
