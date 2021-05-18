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

  async actualizarCategoriaToWC(c:Categoria){

    try{
      let resp = await this.getOne(c.woocommerce.id).toPromise()
      let wcCategoria = this.convertFirebasetoWC(c);

      try{
        let categWC:any = await this.updateOne(wcCategoria.id,wcCategoria).toPromise()
        console.log("Categoria actualizado en woocommerce");
        c.woocommerce.id = categWC.id
        c.woocommerce.lastUpdate  = new Date()        

        this.categoriasService.update(c).then(data=>{
          console.log("LastUpdate de Woocommerce guardado")
        })
      }
      catch(err){
        console.log(err)
      }
     
    }
    catch(err){
      console.log(err)
      if(err.error.code == "woocommerce_rest_product_invalid_id"){
        console.log("El id del categoria no se encuentra")
        await this.crearCategoriaToWC(c)
      }
      if(err.error.code == "woocommerce_rest_cannot_edit"){
        console.log("No tienes permiso para editar")
      }
    }
  
     
  }

  async crearCategoriaToWC(c:Categoria){

    let wcCtegory = this.convertFirebasetoWC(c);
    
    let cat = new Categoria()
    cat.asignarValores(c) //esto para que cargue las variables a los productos viejos aunque sea vacias


    const data = JSON.parse(JSON.stringify(wcCtegory));

    try{
      let resp:any = await this.postOne(data).toPromise()
     
      c.woocommerce.id = resp.id
      c.woocommerce.lastUpdate  = new Date()         

      this.categoriasService.update(c).then(data=>{
        console.log("LastUpdate de Woocommerce guardado")
      })
    }
    catch(err){    
      console.log(err)
      if(err.error.code == "term_exists"){
        console.log("Ya existe una categoria con ese nombre")
        let woocommerceSinc = {
          id:err.error.data.resource_id,
          lastUpdate : new Date(),
          sincronizado:true
        }
  
        this.categoriasService.update(c).then(data=>{
          console.log("LastUpdate de Woocommerce guardado")
        })
      }
    }
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

  public syncFirebaseToWC_OLD():Promise<any>{

    return new Promise((resolve,reject)=>{

      console.log("sincronizando...")
      let categoriasFirebase = []

      //Subimos todo a Woocommerce
      let subsItem = this.categoriasService.list().subscribe(async categorias => { 
        subsItem.unsubscribe();

        categoriasFirebase = categorias;
        for(let c of categoriasFirebase) {    
          let cat = new Categoria()
          cat.asignarValores(c) //esto para que cargue las variables a los productos viejos aunque sea vacias

          
          if(c.woocommerce.id == ""){   //si jamas fue sincronizado    
            await this.crearCategoriaToWC(cat);        
          }
          else{ 
           
    
              try{
                let data = await this.getOne(c.woocommerce.id).toPromise()
                cat.updatedAt = cat.updatedAt.toDate().setSeconds(cat.updatedAt.toDate().getSeconds());
                c.woocommerce.lastUpdate = c.woocommerce.lastUpdate.toDate().setSeconds(c.woocommerce.lastUpdate.toDate().getSeconds() + 100);
      
                
                console.log(c.woocommerce.lastUpdate)
                console.log(cat.updatedAt)

                if(cat.updatedAt > c.woocommerce.lastUpdate){                     
                  this.actualizarCategoriaToWC(cat);   
                  console.log("Actualizado categoria ")            
                } 
                else{
                  console.log("Categoria existe y está actualizado:")                
                }  
              }
              catch(err){
                console.log(err)

                if(err.error.code == "woocommerce_rest_term_invalid"){
                  await this.crearCategoriaToWC(cat)
                }
                if(err.error.code == "woocommerce_rest_product_invalid_id"){
                  await this.crearCategoriaToWC(cat)                    
                }
                if(err.error.code == "woocommerce_rest_cannot_edit"){                  
                  console.log("No tienes permiso para editar")
                }

                
              }
          
          }
        }
        
        //Ya se subió todo a Woocommerce, ahora todo lo que sobre será cargado en Firebase
        try{
          let categoriasWC:any 
          categoriasWC = await this.getAll().toPromise();

          for(let catWc of categoriasWC){
            console.log(catWc)  
            const found = categoriasFirebase.some(r => {return catWc.id == r.woocommerce.id
            })
            if(!found){
              console.log("no existe en fb")
              let nueva = this.convertWCToFirebase(catWc)
              this.categoriasService.add(nueva).then(data=>{
                console.log("Nueva categoria obtenida de Woocommerce")
              })
            }
            else{
              console.log("existe en fb")
            }
          }
        }
        catch(err){
          console.log(err)
        }
       
        resolve(true)
      },err=>{
        reject()
      })


    })
    
    
  }

}
