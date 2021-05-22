import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { rejects } from 'assert';
import { resolve } from 'dns';
import { Observable } from 'rxjs';
import { Categoria } from 'src/app/models/categoria';
import { WCCategory } from 'src/app/models/woocommerce/category';
import { WCImage } from 'src/app/models/woocommerce/image';
import { CategoriasService } from '../categorias.service';
import { ComerciosService } from '../comercios.service';
import { WordpressService } from '../wordpress/wordpress.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private comercio:any
  private apiUrl:string = '';
  private siteURL:string  = ''
  private woocommercePart:string = '/wp-json/wc/v3/';
  private tipoItem = "products/categories"

  constructor(
    private http:HttpClient,
    private comerciosService:ComerciosService,
    private wordpressService:WordpressService,
    private categoriasService:CategoriasService
  ) { }

  
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

  convertFirebasetoWC(categoria:Categoria){
    let categoriaWC = new WCCategory()
    categoriaWC.image = new WCImage()
    categoriaWC.name = categoria.nombre
    categoriaWC.image.src = categoria.foto
    categoriaWC.description = categoria.descripcion
    return categoriaWC;
  }

  convertWCToFirebase(categoriaWC:WCCategory){
    let categoria = new Categoria()

    if(categoriaWC.image)
      categoria.foto = categoriaWC.image.src

    categoria.nombre = categoriaWC.name
    categoria.id = categoriaWC.id
    categoria.descripcion = categoriaWC.description

    categoria.updatedAt = new Date()
    
    return categoria

  }

/*
  actualizarCategoriaToWC(c:Categoria){

    let cat = new Categoria()
    cat.asignarValores(c) //esto para que cargue las variables a los productos viejos aunque sea vacias

    
    this.getOne(catWCSyncData.id).subscribe(data=>{
      
      let wcCategoria = this.categoriaFirebasetoWC(c);
      wcCategoria.id = catWCSyncData.id
      this.updateOne(wcCategoria.id,wcCategoria).subscribe(data=>{
        
        console.log("Porducto actualizado en woocommerce");
        catWCSyncData.lastUpdate = new Date();

        this.categoriasService.update(c).then(data=>{
          console.log("LastUpdate de Woocommerce guardado")
        })
      },err=>{
        console.log(err)
      })
    },err=>{
      console.log(err)
      if(err.error.code == "woocommerce_rest_product_invalid_id"){
        console.log("El id del producto no se encuentra")
        this.crearCategoriaToWC(c)
      }
      if(err.error.code == "woocommerce_rest_cannot_edit"){
        console.log("No tienes permiso para editar")
      }
    })
  }
*/

public syncFirebaseToWC(){
  this.categoriasService.list().subscribe(categorias =>{
    categorias.forEach(element => {
      element.woocommerce.sincronizado = true;
      this.categoriasService.update(element)
    });
  })
}


}
