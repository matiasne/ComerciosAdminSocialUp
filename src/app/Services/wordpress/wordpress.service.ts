import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { WCPorduct } from 'src/app/models/woocommerce/product';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {

  public apiUrl:string = '';
  private siteURL:string  = 'http://laparrilladegerardo.com.ar'
  private woocommercePart:string = '/wp-json/wp/v2/';
  private tipoItem:string = "";

  constructor( 
    public http:HttpClient 
  ) { }

  setPart(part:string){
    this.tipoItem = part;
    this.apiUrl = this.siteURL+this.woocommercePart+this.tipoItem;
  }

  getAll(){
    this.apiUrl = this.siteURL+this.woocommercePart+this.tipoItem;
    return this.http.get(this.apiUrl); 
  }

  getOne(id){
    this.apiUrl = this.siteURL+this.woocommercePart+this.tipoItem+"/"+id;

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
    this.apiUrl = this.siteURL+this.woocommercePart+this.tipoItem;

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
    this.apiUrl = this.siteURL+this.woocommercePart+this.tipoItem+"/"+id;

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
    this.apiUrl = this.siteURL+this.woocommercePart+this.tipoItem+"/"+id;


    console.log(this.apiUrl)
    return this.http.delete(this.apiUrl); 
  }


}
