import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComerciosService } from '../comercios.service';
import { WordpressService } from '../wordpress/wordpress.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private comercio:any
  private apiUrl:string = '';
  private siteURL:string  = ''
  private woocommercePart:string = '/wp-json/wc/v3/';

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
    this.apiUrl = this.comercio.woocommerce.url+this.woocommercePart+"orders?consumer_key="+this.comercio.woocommerce.consumerKey+"&consumer_secret="+this.comercio.woocommerce.consumerSecret
    return this.http.get(this.apiUrl,options); 
  }

  getProcessing(){
    let httpHeaders = new HttpHeaders({
       'Content-Type' : 'application/json',
       'Authorization' : 'Bearer '+this.wordpressService.getToken()
     });      
     let options = {
       headers: httpHeaders
     };     

    this.comercio = this.comerciosService.getSelectedCommerceValue()
    this.apiUrl = this.comercio.woocommerce.url+this.woocommercePart+"orders?status=processing&consumer_key="+this.comercio.woocommerce.consumerKey+"&consumer_secret="+this.comercio.woocommerce.consumerSecret
    return this.http.get(this.apiUrl,options); 
  }

  

  updateStatus(order){
    let httpHeaders = new HttpHeaders({
       'Content-Type' : 'application/json',
       'Authorization' : 'Bearer '+this.wordpressService.getToken()
     });      
     let options = {
       headers: httpHeaders
     };     
  
    this.comercio = this.comerciosService.getSelectedCommerceValue()
    this.apiUrl = this.comercio.woocommerce.url+this.woocommercePart+"orders/"+order.id+"?consumer_key="+this.comercio.woocommerce.consumerKey+"&consumer_secret="+this.comercio.woocommerce.consumerSecret
    
    let body ={
      status:"processing"
    }
    
    return this.http.post(this.apiUrl,body,options); 
  }
  

  
}

