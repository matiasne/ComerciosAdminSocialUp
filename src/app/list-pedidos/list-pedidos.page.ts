import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonSearchbar, ModalController } from '@ionic/angular';
import { Observable, Subscriber } from 'rxjs';
import { DetailsPedidoPage } from '../details-pedido/details-pedido.page';
import { FormFilterPedidosPage } from '../form-filter-pedidos/form-filter-pedidos.page';
import { EnumEstadoCocina, EnumEstadoCobro, Pedido } from '../models/pedido';
import { WCOrder } from '../models/woocommerce/order';
import { AuthenticationService } from '../Services/authentication.service';
import { ComentariosService } from '../Services/comentarios.service';
import { NavegacionParametrosService } from '../Services/global/navegacion-parametros.service';
import { LoadingService } from '../Services/loading.service';
import { PedidoService } from '../Services/pedido.service';
import { PedidosWoocommerceService } from '../Services/pedidos-woocommerce.service';
import { UsuariosService } from '../Services/usuarios.service';
import { OrdersService } from '../Services/woocommerce/orders.service';

@Component({
  selector: 'app-list-pedidos',
  templateUrl: './list-pedidos.page.html',
  styleUrls: ['./list-pedidos.page.scss'],
})
export class ListPedidosPage implements OnInit {

  @ViewChild(IonSearchbar, { static: false }) ionSearchbar: IonSearchbar;

  @ViewChild(IonSearchbar) set content(content: IonSearchbar) {
    if(content) { // initially setter gets called with undefined
        this.ionSearchbar = content;
    }
 }
 
  public pedidosLocalesAll:any = []
  public pedidosLocales:any =[]

  public pedidosWoocommerceAll:any = []
  public pedidosWoocommerce = []

  public palabraFiltro = "";
  public userRol = "";
  public fechaDesde = new Date();
  public fechaHasta = new Date();
  public estado = "";
  public fuente = "";

  public obsPedidos

  public cEstado = EnumEstadoCobro;
  public seccionActiva = this.cEstado.pendiente; 

  public buscando = true;

  public pedidosObs:any

  public connectionStatus = "offline"

  public showSearchBar = false;

  constructor(
    private pedidosService:PedidoService,
    private alertController:AlertController,
    public router:Router,
    public modalController:ModalController,
    public loadingService:LoadingService,
    public comentariosService:ComentariosService,
    public authService:AuthenticationService,
    public changeRef:ChangeDetectorRef,
    public navParametrosService:NavegacionParametrosService,
    public pedidosWoocommerceService:PedidosWoocommerceService,
    private usuariosServices:UsuariosService
  ) { }

  ngOnInit() {
    this.authService.userRol.subscribe(rol =>{
      this.userRol = rol; 
    })
    this.fechaDesde.setDate(this.fechaDesde.getDate() - 2);    
    
    this.usuariosServices.getConnectionStatus().subscribe(data=>{
      this.connectionStatus = data
    })

  }

  ionViewDidEnter(){ 
    this.loadingService.presentLoadingText("Cargando Pedidos") 
    this.refrescar();
    this.changeRef.detectChanges()    
  }  

  onChange(event){
    this.palabraFiltro = event.target.value;    
    this.buscar();
  }

  onChangeAtras(event){
    this.fechaDesde = new Date();
    this.fechaDesde.setDate(this.fechaDesde.getDate() - Number(event.target.value));
    this.refrescar()   
  }
 
  reanudar(item){ 
    item.statusCobro = this.cEstado.pendiente;
    this.pedidosService.update(item).then(data=>{
      console.log("El pedido ha sido suspendido");
      this.refrescar();
    })  
  }

  async cancelar(item){

    const alert = await this.alertController.create({
      header: 'Está seguro que desea suspender el pedido en curso?',
      message: '',
      buttons: [ 
        {
          text: 'No',
          handler: (blah) => {
            
          }
        }, { 
          text: 'Sí',
          handler: () => {               
            item.statusCobro = this.cEstado.suspendido;
            this.pedidosService.update(item).then(data=>{
              console.log("El pedido ha sido suspendido");
              this.refrescar();
            })     
          }
        }
      ]
    });
    await alert.present();   
  }

  async seleccionar(item){
   
    let editarPedido = new Pedido();
    editarPedido.asignarValores(item);
    
    this.navParametrosService.param = editarPedido;
    this.router.navigate(['details-pedido'])
  }

  buscarWoocommerce(){

    var retorno = false;
    this.pedidosWoocommerce = []; 
    this.pedidosWoocommerceAll.forEach(item => {  

      var encontrado = true;    
      
      //Por ahora solo el administrador puede ver los pedidos de woocommerce
      if(this.userRol == "Administrador"){
        encontrado = true;
      }
     
      if(encontrado){
        encontrado = false;

        if(this.palabraFiltro != ""){

          encontrado = false;
          var palabra = this.palabraFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, "")      
        
          if(item.shipping.first_name){
            retorno =  (item.shipping.first_name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
            if(retorno)
              encontrado = true;
          }

          if(item.shipping.last_name){
            retorno =  (item.shipping.last_name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
            if(retorno)
              encontrado = true;
          }   
        }
        else{
          encontrado = true; 
        }
      }

      if(encontrado){        
        if(this.seccionActiva == item.statusCobro){
          this.pedidosWoocommerce.push(item)
        }                 
        return true;
      }


    });
  }


  buscar(){ 

    var retorno = false;

    this.pedidosLocales = []; 

    this.pedidosLocalesAll.forEach(item => {  
      
      var encontrado = true;      
      //si no es administrador solo ve los pedidos generados por el
      if(this.userRol == "Administrador"){
        encontrado = true;
      }
      else{
        if(this.authService.getActualUserId() == item.personalId)
          encontrado = true;
      } 

      if(encontrado){
        encontrado = false;

        if(this.palabraFiltro != ""){

          encontrado = false;
          var palabra = this.palabraFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, "")      
        
          if(item.clienteNombre){
            retorno =  (item.clienteNombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
            if(retorno)
              encontrado = true;
          }

          if(item.mesaNombre){
            retorno =  (item.mesaNombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
            if(retorno)
              encontrado = true;
          }   
          
          if(item.personalEmail){
            retorno =  (item.personalEmail.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
            if(retorno)
              encontrado = true;
          }  

          if(item.personalNombre){
            retorno =  (item.personalNombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(palabra.toLowerCase()) > -1);
            if(retorno)
              encontrado = true;
          }  
        }
        else{
          encontrado = true; 
        }
      }      

      
      if(encontrado){         

        let countListos = 0      
        item.productos.forEach(element => {
          if(element.estadoComanda == "Listo")
            countListos++;             
        });   
        
        item.countListos = countListos 
        
        if(this.seccionActiva == item.statusCobro){          
          this.pedidosLocales.push(item)
        }
                 
        return true;
      }
      
    });  
    this.loadingService.dismissLoading(); 
   
  }

  segmentChanged(event){
    console.log(event.target.value);
    this.seccionActiva = event.target.value;
    this.pedidosLocalesAll = [];
    this.refrescar();
  } 

  async showFiltroAvanzado(){
    const modal = await this.modalController.create({
      component: FormFilterPedidosPage      
    });
    modal.onDidDismiss()
    .then((retorno) => {
      if(retorno.data){
        this.fechaDesde = retorno.data.fechaDesde,
        this.fechaHasta = retorno.data.fechaHasta
        this.estado = retorno.data.estado
        this.fuente = retorno.data.fuente
        this.refrescar()
      }       
    });
    return await modal.present();    
  }
 
  refrescar(){
  
    let date = new Date(this.fechaDesde) 
    let fechaHasta = new Date();

    if(!this.obsPedidos)
    this.pedidosObs = this.pedidosService.listFechaDesde(date,fechaHasta).subscribe((pedidos:any)=>{
      this.pedidosLocalesAll = pedidos; 
      console.log(this.pedidosLocalesAll)
      this.buscando = false;
      this.buscar(); 
      this.pedidosObs.unsubscribe()
    })  

    this.pedidosWoocommerceService.list().subscribe((pedidos:any) =>{
      console.log(pedidos)
      this.pedidosWoocommerceAll = pedidos;
      this.buscarWoocommerce();      
    })

  }

  nuevoPedido(){
    this.router.navigate(['list-productos-servicios',{carritoIntended:'list-pedidos'}])
  }

  seleccionarPedidoWoocommerce(order){
    let o = new WCOrder();
    o.asignarValores(order);
    
    this.navParametrosService.param = o;
    this.router.navigate(['details-pedido-woocommerce'])
  }

  
  focusBuscar(){
    this.showSearchBar = true;
    setTimeout(() => {
          // Set the focus to the input box of the ion-Searchbar component
    this.ionSearchbar.setFocus();
    },100);
  
  }


}
