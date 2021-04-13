import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { WCPorduct } from 'src/app/models/woocommerce/product';
import { ComerciosService } from '../comercios.service';

@Injectable({
  providedIn: 'root'
})
export class WoocommerceService {

  private comercio:any
  private apiUrl:string = '';
  private siteURL:string  = ''
  private woocommercePart:string = '/wp-json/wc/v3/';
  private tipoItem:string = "";

  constructor( 
    private http:HttpClient,
    private comerciosService:ComerciosService
  ) { 

    this.comerciosService.getSelectedCommerce().subscribe(data=>{
      this.comercio.asignarValores(data);
    })
  }

  setPart(part:string){
    this.tipoItem = part;
  }

  getAll(){
    this.apiUrl = this.comercio.woocommerce.url+this.woocommercePart+this.tipoItem+"?consumer_key="+this.comercio.woocommerce.consumerKey+"&consumer_secret="+this.comercio.woocommerce.consumerSecret
    return this.http.get(this.apiUrl); 
  }

  getOne(id){
    this.apiUrl = this.comercio.woocommerce.url+this.woocommercePart+this.tipoItem+"/"+id+"?consumer_key="+this.comercio.woocommerce.consumerKey+"&consumer_secret="+this.comercio.woocommerce.consumerSecret

    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json'
    });     
    let options = {
      headers: httpHeaders
    };     

    console.log(this.apiUrl)
    return this.http.get(this.apiUrl); 
  }

  postOne(data){
    this.apiUrl = this.comercio.woocommerce.url+this.woocommercePart+this.tipoItem+"?consumer_key="+this.comercio.woocommerce.consumerKey+"&consumer_secret="+this.comercio.woocommerce.consumerSecret

    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json'
    });     
    let options = {
      headers: httpHeaders
    };     

    console.log(this.apiUrl)
    return this.http.post(this.apiUrl,data,options); 

  }

  updateOne(id, data){
    this.apiUrl = this.comercio.woocommerce.url+this.woocommercePart+this.tipoItem+"/"+id+"?consumer_key="+this.comercio.woocommerce.consumerKey+"&consumer_secret="+this.comercio.woocommerce.consumerSecret

    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json'
    });     
    let options = {
      headers: httpHeaders
    };     

    console.log(this.apiUrl)
    return this.http.put(this.apiUrl,data,options); 
  }

  deleteOne(id){
    this.apiUrl = this.comercio.woocommerce.url+this.woocommercePart+this.tipoItem+"/"+id+"?consumer_key="+this.comercio.woocommerce.consumerKey+"&consumer_secret="+this.comercio.woocommerce.consumerSecret


    console.log(this.apiUrl)
    return this.http.delete(this.apiUrl); 
  }

  
  crearProducto(producto:Producto,fotos){

    let wcProducto = new WCPorduct();

    wcProducto.name = producto.nombre;
    wcProducto.price = producto.precio.toString();
    wcProducto.description = producto.descripcion;
    wcProducto.sale_price = producto.promocion.toString();
    wcProducto.sku = producto.barcode;
    wcProducto.stock_quantity = producto.stock.toString();    
    //Falta agregar el tema de los atributos para que se vean las variaciones!!!
    fotos.forEach(foto => {
      if(foto.id != ""){
        wcProducto.images.push({"src":foto.url})
      }      
    });

    const data = JSON.parse(JSON.stringify(wcProducto));






  }

  actualizarProducto(){
    //busco el producto por id de woocommerce elimino todas las imágenes del mismo, elimino el producto. cargo el producto de nuevo
  }


}
