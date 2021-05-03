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

  comercio:Comercio;
  categorias = []
  itemsAllProductos:any=[];
  itemsProductos:any = [];
  
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

      
    }
    else{      
      this.itemsProductos = this.itemsAllProductos;
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
    this.modalCtrl.dismiss(producto)      
  }

  

  async agregarDescuento(){
    
    const modal = await this.modalCtrl.create({
      component: FormDescuentoPage
    });  

    modal.onDidDismiss().then((retorno) => {
      if(retorno.data){  
        this.modalCtrl.dismiss(retorno.data)        
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
        this.modalCtrl.dismiss(retorno.data)        
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
