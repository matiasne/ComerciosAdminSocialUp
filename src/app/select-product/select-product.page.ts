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
import { FormStockPage } from '../form-stock/form-stock.page';
import { Comercio } from '../models/comercio';
import { AuthenticationService } from '../Services/authentication.service';
import { VariacionesStocksService } from '../Services/variaciones-stocks.service';
import { FormDescuentoPage } from '../form-descuento/form-descuento.page';
import { FormRecargoPage } from '../form-recargo/form-recargo.page';
import { Pedido } from '../models/pedido';
import { ComandaPage } from '../impresiones/comanda/comanda.page';
import { NavegacionParametrosService } from '../Services/global/navegacion-parametros.service';
import { WoocommerceService } from '../Services/woocommerce/woocommerce.service';

@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.page.html',
  styleUrls: ['./select-product.page.scss'],
})
export class SelectProductPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
  comercio:Comercio;

  itemsAllProductos:any=[];
  itemsProductos:any = [];
  itemsRenderProductos:any = [] 

  itemsPerPage = 20
  itemsRenderizados = 0;
  
  categorias = []
  
  public subsItemsProd: Subscription;
  public subsComercio: Subscription;
  public palabraFiltro = "";
  public ultimoItem = "";
  public loadingActive = false;
  public showProductos:boolean = true;
  public buscandoProductos = true;

  public isMobile = false;

  constructor(
    public productosService:ProductosService,
    public modalCtrl: ModalController,
    public submodalCtrl: ModalController,
    public comerciosService:ComerciosService,
    public loadingService:LoadingService,
    public changeRef:ChangeDetectorRef,
    private categoriasService:CategoriasService,
    private AuthenticationService:AuthenticationService,
    private platform:Platform,    
    private router:Router
  ) { 
   

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

    this.obtenerTodo();      
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


  async seleccionarProducto(producto){   
    //this.modalCtrl.dismiss(producto)      

    const modal = await this.submodalCtrl.create({
      component: AddProductoVentaPage,
      id: '1',
      componentProps:{
        producto:producto
      }
    });        

    modal.onDidDismiss().then(async (retorno) => { 

      if(retorno.data){
        await this.modalCtrl.dismiss(retorno.data,undefined,'1')  
        this.modalCtrl.dismiss(retorno.data);     
      }
    });

    return await modal.present();

  }



  async agregarDescuento(){
    
    const modal = await this.submodalCtrl.create({
      component: FormDescuentoPage,
      id: '1'
    });  

    modal.onDidDismiss().then(async (retorno) => {
      if(retorno.data){  
        console.log(retorno.data)
        await this.modalCtrl.dismiss(retorno.data,undefined,'1')  
        this.modalCtrl.dismiss(retorno.data);     
      }        
    }); 
      
    

    return await modal.present();
  }

  async agregarRecargo(){
    const modal = await this.submodalCtrl.create({
      component: FormRecargoPage,
      id: '1'
    });  

    modal.onDidDismiss().then(async (retorno) => {
      if(retorno.data){  
        await this.modalCtrl.dismiss(retorno.data,undefined,'1')  
        this.modalCtrl.dismiss(retorno.data);     
      }        
    }); 

    return await modal.present(); 
  }


  verProductos(categoria){

    if(categoria!= '')
      this.palabraFiltro = categoria.nombre.toLowerCase();
    else
      this.palabraFiltro = "";
   

    
    if(categoria != ''){      
      categoria.seleccionado = true;     
    }
    else{
      this.palabraFiltro = '';
    }    
  }


}
