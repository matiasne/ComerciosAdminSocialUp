import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { FirestorageService } from './firestorage.service';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from './toast.service';
import { BaseService } from './base.service';
import { Archivo } from '../models/foto';

@Injectable({
  providedIn: 'root'
})
export class FotoService extends BaseService {

  
  public porcentajeSubject = new BehaviorSubject <any>("");
  public listoSubject = new BehaviorSubject <any>("");
  public borradoSubject = new BehaviorSubject <any>("");
  public finalizado = false;
  public elementId = "";

  constructor(
    protected afs: AngularFirestore,
    private firebaseStorage: FirestorageService,
    private toastService:ToastService
  ) { 
    
    super(afs);
    this.listoSubject.next(false);
    this.borradoSubject.next(false);
  }

  setPathFoto(tipo,id){
    this.setPath(tipo+"/"+id+"/fotos");

    this.elementId = id;
    console.log(this.path);
  }

  deleteArchivo(item,id){ 
    this.delete(item.id).then(data=>{ 
      
    }) 
    
    let referencia = this.firebaseStorage.refFile(item.name+"."+item.format);
      referencia.delete().subscribe(data=>{
        console.log(data);        
          this.borradoSubject.next(true);
          this.borradoSubject.next(false);        
      },error=>{
        console.log(error)
          this.borradoSubject.next(true);
          this.borradoSubject.next(false); 
      }); 
  }


  async cargarFotoAElemeto(item:string,id,blob,principal:boolean){
    this.setPathFoto(item,id)

    let nombre = Math.floor(Math.random() * 100000000000)+"_"+id; 

    let file = new Archivo();   

    await this.upload(blob, nombre.toString(),"jpg").then(url =>{
      
      file.url = url;
      file.name = nombre.toString();  
      file.format = "jpg"; 
      file.principal = principal
     
      
    });  

    const f = JSON.parse(JSON.stringify(file)); 
    await this.add(f).then(data =>{
      console.log(data);          
    });

    return file
    
  }

  upload(archivo,nombre,tipo){

    this.finalizado = false;

    let nombreArchivo = nombre+'.'+tipo;

    let referencia = this.firebaseStorage.refFile(nombreArchivo);

    return new Promise((resolve, reject)=>{

      referencia.getDownloadURL().subscribe(data=>{
        this.toastService.mensaje("","ya existe un archivo con ese nombre");
        reject();
      }, error=>{
        let tarea = this.firebaseStorage.upload(nombreArchivo, archivo);
      
          tarea.then(data=>{
  
              console.log(data);
                       
              
              referencia.getDownloadURL().subscribe((URL) => {        

                this.finalizado = true;
                this.porcentajeSubject.next(0);
                this.listoSubject.next(true);
                this.listoSubject.next(false);
                resolve(URL);
              });
          });
  
          tarea.catch(data=>{
            console.log(data);
            reject();
          })
  
          this.firebaseStorage.upload(nombreArchivo, archivo).catch(data=>{
            console.log(data);
            reject();
          });
  
          tarea.percentageChanges().subscribe((porcentaje) => {
            let p = Math.round(porcentaje);  
            this.porcentajeSubject.next(p);  
          });
      });


    });
    
  }
   
  
}
