import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebHook } from 'src/app/models/woocommerce/webhook';
import { ComerciosService } from '../comercios.service';
import { WordpressService } from '../wordpress/wordpress.service';

@Injectable({
  providedIn: 'root'
})
export class WebhooksService {

  
  private comercio:any
  private apiUrl:string = '';
  private siteURL:string  = ''
  private woocommercePart:string = '/wp-json/wc/v3/';
  private tipoItem = "webhooks"
  constructor(
    private http:HttpClient,
    private comerciosService:ComerciosService,
    private wordpressService:WordpressService,
  ) { }

  getAll(){
    let httpHeaders = new HttpHeaders({
       'Content-Type' : 'application/json',
       'Authorization' : 'Bearer '+this.wordpressService.getToken()
     });      
     let options = {
       headers: httpHeaders
     };     

    this.comercio = this.comerciosService.getSelectedCommerceValue()
    this.apiUrl = this.comercio.woocommerce.url+this.woocommercePart+this.tipoItem+"?consumer_key="+this.comercio.woocommerce.consumerKey+"&consumer_secret="+this.comercio.woocommerce.consumerSecret
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


  async pause(){
    let webhooks:any = await this.getAll().toPromise()
    for(let w of webhooks){
      let webhook = new WebHook()
      webhook.asignarValores(w) //esto para que cargue las variables a los productos viejos aunque sea vacias

      console.log("pause")
      webhook.status = "paused"
      console.log(webhooks)
      try{
        let resp =await this.updateOne(webhook.id,webhook).toPromise()
        console.log("Webhook pausado")
      }catch(err){
        console.log(err)
      }
      
    }
  }


  async enable(){
    let webhooks:any = await this.getAll().toPromise()
    for(let w of webhooks){
      let webhook = new WebHook()
      webhook.asignarValores(w) //esto para que cargue las variables a los productos viejos aunque sea vacias

      webhook.status ="active"
      try{
        await this.updateOne(webhook.id,webhook).toPromise()
        console.log("webhook habilitado")
      }
      catch(err){
        console.log(err)
      }
      
    }
  }

  async sincronizar(){
    let nuevoProducto = false;
    let nuevoPedido = false;

    try{
      let webhooks:any = await this.getAll().toPromise()
      for(const wh of webhooks){
        if(wh.name == "Nuevo Pedido Firebase")
          nuevoPedido = true
      
        if(wh.name == 'Nuevo Producto Firebase')
          nuevoProducto = true
     }

     
/*
     if(!nuevoProducto){
      let webhook = new WebHook()
      webhook.name = "Nuevo Producto Firebase"
      webhook.status = "active"
      webhook.topic ="product.created"
      webhook.resource = "product"
      webhook.event = "created"
      webhook.delivery_url = "https://us-central1-comercios-admin-socialup.cloudfunctions.net/api/woocommerce/NuevoProducto?comercioId="+this.comerciosService.getSelectedCommerceValue().id
      webhook.date_created = new Date().toDateString()
      webhook.hooks=[
        "woocommerce_process_product_meta",
        "woocommerce_new_product",
        "woocommerce_new_product_variation"
      ]

     
        
     }
     else{
      console.log("Webhook nuevo producto ya existe")
    }*/

     if(!nuevoPedido){
      
        let webhook = new WebHook()
        webhook.name = "Nuevo Pedido Firebase"
        webhook.status = "active"
        webhook.topic ="order.created"
        webhook.resource = "order"
        webhook.event = "created"
        webhook.delivery_url = "https://us-central1-comercios-admin-socialup.cloudfunctions.net/api/woocommerce/NuevoPedido?comercioId="+this.comerciosService.getSelectedCommerceValue().id
        webhook.date_created = new Date().toDateString()
        webhook.hooks=[
          "woocommerce_new_order"
        ]

        await this.postOne(webhook).toPromise()
      }
      else{
        console.log("Webhook nuevo pedido ya existe")
      }

    }
    catch(err){
      console.log(err)
    }
    
     

    
  }

  
}
