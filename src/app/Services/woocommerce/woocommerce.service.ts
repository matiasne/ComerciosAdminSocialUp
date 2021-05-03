import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto } from 'src/app/models/producto';
import { WCProduct } from 'src/app/models/woocommerce/product';
import { ComerciosService } from '../comercios.service';
import { FotoService } from '../fotos.service';
import { ProductosService } from '../productos.service';
import { WordpressService } from '../wordpress/wordpress.service';
import { WebhooksService } from './webhooks.service';

@Injectable({
  providedIn: 'root'
})
export class WoocommerceService {

  private comercio:any
  private apiUrl:string = '';
  private siteURL:string  = ''
  private woocommercePart:string = '/wp-json/wc/v3/';
  private tipoItem:string = "";

  public progresoSend = new BehaviorSubject <any>(0);
  public progresoReceived = new BehaviorSubject <any>(0);

  private total = 0;
  private psend = 0;
  private preceived = 0;
  
  constructor( 
    private http:HttpClient,
    private comerciosService:ComerciosService,
    private productosServices:ProductosService,
    private wordpressService:WordpressService,
    private fotosService:FotoService,
    private webhookService:WebhooksService
  ) {    
    
  }

  setPart(part:string){
    this.tipoItem = part;
  }

  obsProgresoSend(): Observable<any>{
    return this.progresoSend.asObservable();
  }

  obsProgresoReceived(): Observable<any>{
    return this.progresoReceived.asObservable();
  }

  test(){
    let httpHeaders = new HttpHeaders({
       'Access-Control-Allow-Origin':'*',
       'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
       'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
       'Content-Type' : 'application/json',
       'Authorization' : 'Bearer '+this.wordpressService.getToken()
     });      
     let options = {
       headers: httpHeaders
     };     
     
    this.comercio = this.comerciosService.getSelectedCommerceValue()
    this.apiUrl = this.comercio.woocommerce.url+this.woocommercePart+"system_status?consumer_key="+this.comercio.woocommerce.consumerKey+"&consumer_secret="+this.comercio.woocommerce.consumerSecret
    return this.http.get(this.apiUrl,options); 
  }

  
  getAll(){
    let httpHeaders = new HttpHeaders({
    //   'Access-Control-Allow-Origin':'*',
    //   'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
    //   'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
       'Content-Type' : 'application/json',
       'Authorization' : 'Bearer '+this.wordpressService.getToken()
     });      
     let options = {
       headers: httpHeaders
     };     
     console.log("test")
    this.comercio = this.comerciosService.getSelectedCommerceValue()
    this.apiUrl = this.comercio.woocommerce.url+this.woocommercePart+this.tipoItem+"?consumer_key="+this.comercio.woocommerce.consumerKey+"&consumer_secret="+this.comercio.woocommerce.consumerSecret
    return this.http.get(this.apiUrl,options).toPromise(); 
  }

  getOne(id){
    this.comercio = this.comerciosService.getSelectedCommerceValue()
    this.apiUrl = this.comercio.woocommerce.url+this.woocommercePart+this.tipoItem+"/"+id+"?consumer_key="+this.comercio.woocommerce.consumerKey+"&consumer_secret="+this.comercio.woocommerce.consumerSecret

    let httpHeaders = new HttpHeaders({
    //  'Access-Control-Allow-Origin':'*',
    //  'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
    //  'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
      'Content-Type' : 'application/json',
      'Authorization' : 'Bearer '+this.wordpressService.getToken()
    });      
    let options = {
      headers: httpHeaders
    };  
    return this.http.get(this.apiUrl,options); 
  }

  postOne(data){

    
    this.comercio = this.comerciosService.getSelectedCommerceValue()
    this.apiUrl = this.comercio.woocommerce.url+this.woocommercePart+this.tipoItem+"?consumer_key="+this.comercio.woocommerce.consumerKey+"&consumer_secret="+this.comercio.woocommerce.consumerSecret

    let httpHeaders = new HttpHeaders({
     // 'Access-Control-Allow-Origin':'*',
    //  'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
    //  'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
      'Content-Type' : 'application/json',
      'Authorization' : 'Bearer '+this.wordpressService.getToken()
    });      
    let options = {
      headers: httpHeaders
    };     

    return this.http.post(this.apiUrl,data,options); 

  }

  updateOne(id, data){
    this.comercio = this.comerciosService.getSelectedCommerceValue()
    this.apiUrl = this.comercio.woocommerce.url+this.woocommercePart+this.tipoItem+"/"+id+"?consumer_key="+this.comercio.woocommerce.consumerKey+"&consumer_secret="+this.comercio.woocommerce.consumerSecret

    let httpHeaders = new HttpHeaders({
      // 'Access-Control-Allow-Origin':'*',
     //  'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
     //  'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
       'Content-Type' : 'application/json',
       'Authorization' : 'Bearer '+this.wordpressService.getToken()
     });      
     let options = {
       headers: httpHeaders
     };     
    return this.http.put(this.apiUrl,data,options); 
  }

  deleteOne(id){

    let httpHeaders = new HttpHeaders({
      // 'Access-Control-Allow-Origin':'*',
     //  'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
     //  'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
       'Content-Type' : 'application/json',
       'Authorization' : 'Bearer '+this.wordpressService.getToken()
     });      
     let options = {
       headers: httpHeaders
     };     

    this.comercio = this.comerciosService.getSelectedCommerceValue()
    this.apiUrl = this.comercio.woocommerce.url+this.woocommercePart+this.tipoItem+"/"+id+"?consumer_key="+this.comercio.woocommerce.consumerKey+"&consumer_secret="+this.comercio.woocommerce.consumerSecret

    return this.http.delete(this.apiUrl,options); 
  }

  updateStock(producto:Producto){

    if(producto.woocommerce.id){
      let data = {
        stock: producto.stock
      }  
      this.comercio = this.comerciosService.getSelectedCommerceValue()
      this.apiUrl = this.comercio.woocommerce.url+this.woocommercePart+this.tipoItem+"/"+producto.id+"?consumer_key="+this.comercio.woocommerce.consumerKey+"&consumer_secret="+this.comercio.woocommerce.consumerSecret

      let httpHeaders = new HttpHeaders({
        'Content-Type' : 'application/json'
      });     
      let options = {
        headers: httpHeaders
      };     
      return this.http.put(this.apiUrl,data,options); 
   } 

  }

  productoWCtoFirebase(productoWC){
    this.comercio = this.comerciosService.getSelectedCommerceValue()

    let prod = new Producto()
    prod.nombre = productoWC.name
    prod.precio = productoWC.regular_price
    prod.descripcion = productoWC.description
    prod.promocion = productoWC.price
    prod.barcode = productoWC.sku

    prod.updatedAt = new Date()
    
    if(productoWC.manage_stock)
      prod.stock = productoWC.stock_quantity   

    prod.woocommerce.id = productoWC.id
    prod.woocommerce.lastUpdate = new Date()
    prod.woocommerce.sincronizado = true

    
    return prod;
  }

  productoFirebasetoWC(producto:Producto,fotos){

    this.comercio = this.comerciosService.getSelectedCommerceValue()

    let wcProducto = new WCProduct();   
    wcProducto.name = producto.nombre;
    wcProducto.regular_price = producto.precio.toString();
    wcProducto.description = producto.descripcion;
    wcProducto.price = producto.promocion.toString();
    wcProducto.sku = producto.barcode;

    
    if(this.comercio.config.stock)
      wcProducto.manage_stock = true;
    else
      wcProducto.manage_stock = false;
      
    wcProducto.stock_quantity = producto.stock.toString();
    wcProducto.images = [];    
    //Falta agregar el tema de los atributos para que se vean las variaciones!!!
    for(const foto of fotos){
        wcProducto.images.push({"src":foto.url})
    }

    return wcProducto;

  }

  
  crearProductoInWC(p:Producto){
  
    this.fotosService.setPathFoto("productos",p.id)
    this.fotosService.list().subscribe(f=>{
      let fotos = f;
      let producto = new Producto()
      producto.asignarValores(p) //esto para que cargue las variables a los productos viejos aunque sea vacias
      console.log("creando en wc el producto id:"+producto.id)
      let wcProducto = this.productoFirebasetoWC(producto,fotos);   
      
      wcProducto["meta_data"] = [{

      }]
      const data = JSON.parse(JSON.stringify(wcProducto));

      console.log("creando")
      this.incrementarEnvio();

      this.postOne(data).subscribe((resp:any)=>{
        this.incrementarRespuesta();
        producto.woocommerce.id = resp.id;
        producto.woocommerce.lastUpdate = new Date();      

        this.productosServices.update(producto).then(data=>{
          console.log("LastUpdate de Woocommerce guardado")
          console.log(data)
        })
      })  
    }) 

    
  }

  actualizarProductoInWC(producto:Producto){
    //busco el producto por id de woocommerce elimino todas las imágenes del mismo, elimino el producto. cargo el producto de nuevo

    this.fotosService.setPathFoto("productos",producto.id)
    this.fotosService.list().subscribe(data=>{
      let fotos = data;
      this.incrementarEnvio();
      console.log("actualizando id:"+producto.id)
      this.getOne(producto.woocommerce.id).subscribe(data=>{
      
        let wcProducto = this.productoFirebasetoWC(producto,fotos);
        wcProducto.id = producto.woocommerce.id
        this.updateOne(wcProducto.id,wcProducto).subscribe(data=>{
          
          console.log("Porducto actualizado en woocommerce");
          producto.woocommerce.lastUpdate = new Date();

          this.productosServices.update(producto).then(data=>{
            this.incrementarRespuesta();
            console.log("LastUpdate de Woocommerce guardado")
          })
        },err=>{
          console.log(err)
        })
      },err=>{
        console.log(err)
        if(err.error.code == "woocommerce_rest_product_invalid_id"){
          console.log("El id del producto no se encuentra")
          this.crearProductoInWC(producto)
        }
        if(err.error.code == "woocommerce_rest_cannot_edit"){
          console.log("No tienes permiso para editar")
        }
      })
    })   
  }



  public async syncWCToFirebase(){

    this.webhookService.sincronizar();
    
    this.tipoItem = "products"
    let productos:any = []
    productos = await this.getAll()
    console.log("Data: " + JSON.stringify(productos)); 
    for(const prod of productos) {
      
      let prodsWithId:any = await this.productosServices.getByWocoommerceId(prod.id)

      console.log(prodsWithId)

      if(prodsWithId.docs.length == 0){
        let prodFirebase = this.productoWCtoFirebase(prod)      
        console.log(prodFirebase)
        await this.productosServices.set(prod.id.toString(),prodFirebase)

        for(const foto of prod.images){
          let data = {"url":foto.src}
          this.fotosService.setPathFoto("productos",prod.id.toString())
          this.fotosService.add(data)
        }
        
        //aca guardar las fotos
      }      
    }    
  }
  

  public syncFirebaseToWC(){

    this.webhookService.sincronizar();


    this.psend = 0;
    this.preceived = 0;

    console.log("sincronizando...")

    let subsItemsProd = this.productosServices.list().subscribe(async productos => { 

      this.total = productos.length;

      productos.forEach((prod:Producto) => {    

        if(!prod.woocommerce){       
          this.crearProductoInWC(prod);        
        }
        else{ 
  
          if(prod.woocommerce.id != ""){ 
  
            let lastUpdteDate = new Date(prod.woocommerce.lastUpdate)
        
            console.log(prod.updatedAt.toDate())
            console.log(lastUpdteDate)
            prod.updatedAt.toDate().setSeconds(prod.updatedAt.toDate().getSeconds() + 10);
  
            if(prod.updatedAt.toDate() > lastUpdteDate){                     
                this.actualizarProductoInWC(prod);               
            } 
            else{
              this.getOne(prod.woocommerce.id).subscribe(data=>{              
                this.incrementarEnvio();
                this.incrementarRespuesta();
                console.log("Producto existe y está actualizado:")
              },
              err=>{
                if(err.error.code == "woocommerce_rest_product_invalid_id"){
                  this.crearProductoInWC(prod)                    
                }
                if(err.error.code == "woocommerce_rest_cannot_edit"){                  
                  console.log("No tienes permiso para editar")
                }
              })
            }                 
          }
          else{          
            this.crearProductoInWC(prod)
          }
        }            
      });
      subsItemsProd.unsubscribe();
    })

    
  }



  private incrementarEnvio(){
    this.psend++;
    let progreso = this.psend/this.total
    this.progresoSend.next(progreso);
  }

  private incrementarRespuesta(){   
    this.preceived++;
    let progreso = this.preceived/this.total
    console.log(this.total+" "+this.preceived+" "+progreso+" "+this.progresoReceived.value)
    this.progresoReceived.next(progreso);
  }



}
