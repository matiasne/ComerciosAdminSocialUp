import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComerciosService } from '../comercios.service';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {

  public apiUrl:string = '';
  private siteURL:string  = 'http://laparrilladegerardo.com.ar'
  private woocommercePart:string = '/wp-json/wp/v2/';
  private tipoItem:string = "";

  constructor( 
    public http:HttpClient,
    private comercioService:ComerciosService 
  ) { }

  setPart(part:string){
    this.tipoItem = part;
    this.apiUrl = this.siteURL+this.woocommercePart+this.tipoItem;
  }

  async login(){   
    return new Promise((resolve,reject) =>{
      this.comercioService.getWoocommerceValue(this.comercioService.getSelectedCommerceValue().id).subscribe(values=>{
        let data = {
          username:values.user,
          password:values.password
        }
    
        let httpHeaders = new HttpHeaders({
          'Content-Type' : 'application/json'
        });     
        let options = {
          headers: httpHeaders
        };       
    
        this.apiUrl = values.url+"/wp-json/jwt-auth/v1/token"  
        try{
          let response = this.http.post(this.apiUrl,data,options).toPromise();
          resolve(response);
        }  
        catch(err){
          reject(err)
        }       
        
      },err=>{
        reject(err)
      })
    })
   
   

  }

  async obtainToken(){    
    try{
      let resp:any = await this.login()
      localStorage.setItem('wordpress_token',resp.token)  
    }
    catch(err){
      localStorage.setItem('wordpress_token',"") 
    }
      
  }

  getToken(){
    return localStorage.getItem('wordpress_token');
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
