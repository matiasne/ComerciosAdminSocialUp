import { Component, OnInit, ViewChild} from '@angular/core';
import { ModalController, LoadingController, AlertController, NavController, Platform, IonInfiniteScroll } from '@ionic/angular';
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
import { WoocommerceService } from '../Services/woocommerce/woocommerce.service';
import { WordpressService } from '../Services/wordpress/wordpress.service';
import { Producto } from '../models/producto';
import { UsuariosService } from '../Services/usuarios.service';
import { NotifificacionesAppService } from '../Services/notifificaciones-app.service';


@Component({
  selector: 'app-list-productos-servicios',
  templateUrl: './list-productos-servicios.page.html',
  styleUrls: ['./list-productos-servicios.page.scss'],
})
export class ListProductosServiciosPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
  comercio:Comercio;

  itemsAllProductos:any=[];
  itemsProductos:any = [];
  itemsRenderProductos:any = [] 

  itemsPerPage = 20
  itemsRenderizados = 0;

  public carrito:any

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

  public dragAgregar = false;
  public dragEvent:any

  public connectionStatus = "offline"
  public countNotificaciones = 0

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
    private platform:Platform,
    private wordpressService:WordpressService,
    private usuariosServices:UsuariosService,
    private notificacionesAppService:NotifificacionesAppService
    
  ) { 
    
    this.notificacionesAppService.getSinLeer(this.usuariosServices.usuarioLogueado).subscribe(snapshot =>{
      console.log(snapshot.length)
      this.countNotificaciones = snapshot.length;
    }) 


    this.usuariosServices.getConnectionStatus().subscribe(data=>{
      this.connectionStatus = data
    })

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
    var catSub = this.categoriasService.getAll().subscribe(snapshot =>{
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

    console.log("DidEnter")
    //this.marcarEnCarrito();
    this.wordpressService.obtainToken()
    console.log(this.carrito.productos)
    this.validarEnCarrito()
  }

  ionViewWillEnter(){
   
  }

  ionViewDidLeave(){
    //this.subsItemsProd.unsubscribe();
  }

  validarEnCarrito(){
    this.itemsProductos.forEach(element => {
      element.enCarrito = 0;
      this.carrito.productos.forEach(prod => {        
         
          if(prod.id == element.id){
            element.enCarrito += prod.cantidad;
          }
        });
    }) 
  }

  verMas(){

    console.log("!!!!! Lazy")
    
    if(this.itemsRenderizados < this.itemsPerPage){
      console.log("No hay más!!!"+this.itemsRenderizados)
      this.infiniteScroll.complete();
      this.infiniteScroll.disabled = true;
      return;
    }

    let start = this.itemsRenderizados;
   
    for(let i=start; i < start+this.itemsPerPage;i++){

      if(this.itemsProductos[i] == undefined){
        console.log("No hay más!!! fuera del array"+this.itemsRenderizados)
        this.infiniteScroll.complete();
        this.infiniteScroll.disabled = true;
        return;
      }
      
      if(this.itemsProductos[i].id){
        this.itemsRenderProductos.push(this.itemsProductos[i])
        this.itemsRenderizados +=1;
        console.log("pushing to render") 
      }
     
    }
    this.infiniteScroll.complete();


  }


  buscar(event){ 

    this.itemsRenderProductos = []
    this.itemsRenderizados = 0
    this.infiniteScroll.disabled = false;
    
    if(event)
      this.palabraFiltro = event.target.value;     

    if(this.palabraFiltro != ""){
      var palabra = this.palabraFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

      var retorno = false;

      this.itemsProductos = [];
      
      this.itemsAllProductos.forEach((item) => {      
  
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
            encontrado = true;
          }            
        }       
  
        if(encontrado){
          console.log("agregado a itemsProducto "+item.id)
          this.itemsProductos.push(item);
          if(this.itemsRenderProductos.length < this.itemsPerPage){
            console.log("Renderizando"+item.id)
            this.itemsRenderProductos.push(item)
            this.itemsRenderizados += 1
          }
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
      for(let i=0; i < this.itemsPerPage;i++){
      
        if(this.itemsProductos[i]){
          this.itemsRenderProductos.push(this.itemsProductos[i])
          this.itemsRenderizados +=1;
        }
        else{
          console.log("No hay más!!! fuera del array"+this.itemsRenderizados)
          this.infiniteScroll.complete();
          this.infiniteScroll.disabled = true;
          return;
        }
      }
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
    this.subsItemsProd = this.productosService.list().subscribe(productos => {
      this.itemsAllProductos = productos;  
      this.buscandoProductos = false;
      this.itemsAllProductos.forEach(producto => {         
          producto.producto = true;
          producto.enCarrito = 0;      
      }); 
      this.buscar(undefined);   
      
    });  
  }

  async vaciarCarrito(){
    const alert = await this.alertController.create({
      header: 'Está seguro que desea vaciar todo el carrito?',
      message: '',
      buttons: [
        { 
          text: 'No',
          handler: (blah) => {
            
          }
        }, {
          text: 'Si',
          handler: () => {     
            this.itemsAllProductos.forEach(element => {
              element.enCarrito = 0
            });      
            this.carritoService.vaciar()        
          }
        }
      ]
    });
    await alert.present();   

    
  }

  onDrag(event,producto){
    event.target.getSlidingRatio().then(res=> {
      if(res < -0.8){
        this.dragAgregar = true
        this.dragEvent = event.target   

      }

      if(res == -1){
        this.onDrop2(producto)
      }
    })
  }

  onDrop1(producto){    
    console.log("onDropEnd")
  }

  agregarACarrito(producto){
    this.toastServices.mensaje("Producto "+producto.nombre+" Agregado al carrito","");
    producto.precioTotal = producto.precio
    this.carritoService.agregarProducto(producto);
  }


  onDrop2(producto){
    if(this.dragAgregar){
     
      this.dragAgregar = false
      this.toastServices.mensaje("Producto "+producto.nombre+" Agregado al carrito","");
      producto.precioTotal = producto.precio
      this.carritoService.agregarProducto(producto);
      this.dragEvent.close().then(data=>{
           
          
      })
    }
    
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

  async agregarProducto(producto:Producto){   

    

    const modal = await this.modalCtrl.create({
      component: AddProductoVentaPage,
      componentProps:{
        producto:producto
      }
    });         

    modal.onDidDismiss()
    
    .then((retorno) => { 

      if(retorno.data){   
        producto.enCarrito += retorno.data.cantidad;
        delete retorno.data.keywords;
        //producto.cantidad = retorno.data.cantidad
        //producto.opcionesSeleccionadas = retorno.data.opcionesSeleccionadas
        this.toastServices.mensaje("Producto "+producto.nombre+" Agregado al carrito","");
        this.carritoService.agregarProducto(retorno.data);    
        //this.marcarEnCarrito();         
      }else{

      }     


    });

    await modal.present();

    this.palabraFiltro ="";    
  }

  async agregarDescuento(){
    
    const modal = await this.modalCtrl.create({
      component: FormDescuentoPage
    });  

    modal.onDidDismiss().then((retorno) => {
      if(retorno.data){  
        this.carritoService.agregarDescuento(retorno.data);          
      }        
    }); 

    return await modal.present();
  }

  async agregarRecargo(){
    const modal = await this.modalCtrl.create({
      component: FormRecargoPage
    });  

    modal.onDidDismiss().then((retorno) => {
      if(retorno.data){  
        this.carritoService.agregarRecargo(retorno.data);          
      }        
    }); 

    return await modal.present(); 
  }

  


  async siguiente(){
    
    if(this.comercio.config.cobrarDirectamente)
      this.cobrarDirectamente()
    else
      this.verCarrito(); 
  }

  async verCarrito(){
    console.log(this.route.snapshot.params.carritoIntended)
    this.router.navigate(['details-carrito',{carritoIntended:this.route.snapshot.params.carritoIntended}])  
  }

  async cobrarDirectamente(){

    
    let pedido = new Pedido()  

    pedido.asignarValores(this.carrito)

    pedido.personalId = this.authenticationService.getUID();
    pedido.personalEmail = this.authenticationService.getEmail();
    pedido.personalNombre = this.authenticationService.getNombre();
    

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
    if(this.itemsAllProductos.length > this.comercio.config.productosMaxLength){
      let modal = await this.modalCtrl.create({
        component: CambiarPlanPage,
        componentProps: {
          extraText: "Haz alcanzado el límite de productos de tu plan: "+this.comercio.plan,
          actualPlan:this.comercio.plan
        }
      });  
      return await modal.present();
    }
    else{
      this.router.navigate(['form-producto']);
    }
    
  }
}
