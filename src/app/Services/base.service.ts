import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, CollectionReference } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
    
    private collection: AngularFirestoreCollection;

    private orderBy = {
        campo:"",
        direction:""
    }

    public path:string ="";
    
    constructor(
        protected afs: AngularFirestore
        ) {
     
    } 
  
    public setPath(path){
      this.path = path;
      console.log(this.path)
      this.collection = this.afs.collection(path);
    }

    

    public setOrderBy(campo,direction){
        this.collection = this.afs.collection(this.path,ref=>ref.orderBy(campo,direction));      
    }

   
  
    get(identifier: string) {
      console.log('[BaseService] get: '+this.path+"/"+identifier);
      
      return this.collection
          .doc(identifier) 
          .get()
          .pipe(
              map(doc => {
                  if (doc.exists) {
              /* workaround until spread works with generic types */
                      const data = doc.data() as any;
                      const id = doc.id;
                      data.fromCache = doc.metadata.fromCache;
                      return { id, ...data };
                  }
              })
          ); 
    }

    public search(limit,orderBy,palabra,ultimo){      
        if(ultimo == ""){
          console.log("!!!!!! primero")     
          return this.afs.collection(this.path, ref => 
            ref.where('keywords','array-contains',palabra)
                .where('recibirPedidos','==',true)
                .orderBy(orderBy)
                .limit(limit)).snapshotChanges();
        }
        else{
          return this.afs.collection(this.path, ref => 
            ref.where('keywords','array-contains',palabra)
                .where('recibirPedidos','==',true)
                .orderBy(orderBy)
                .startAfter(ultimo)
                .limit(limit)).snapshotChanges();    
        }    
    }  
  
    getRef(id){
      return this.collection.doc(id).ref;
    }

  
  
    list() {
        console.log('[BaseService] list: '+this.path);    
  
        return this.collection
            .snapshotChanges()
            .pipe(
                map(changes => {
                    return changes.map(a => {
                        const data = a.payload.doc.data();
                        data.id = a.payload.doc.id;
                        data.fromCache = a.payload.doc.metadata.fromCache;
                        return data;
                    });
                })
            );          
      }    
      
      listPromise() {
        console.log('[BaseService] list: '+this.path);    
  
        return this.collection
            .snapshotChanges().toPromise()          
      }   
  
    add(item) {  
        delete item.id;  
        console.log('[BaseService] adding item'+this.path);
        console.log(item);

        let time = new Date();
        const promise = new Promise((resolve, reject) => {
            this.collection.add({...item, createdAt: time}).then((ref:any) => {
                
               
                
                const newItem = {
                    id: ref.id,
                    
                    ...(item as any)
                };
                resolve(newItem);
                
               
                
                
            });
        });
        return promise;
    } 

    set(id,item) {  
    //    delete item.id;  
        console.log('[BaseService] adding item'+this.path+'/'+id);
        console.log(item);

        let time = new Date();
        const promise = new Promise((resolve, reject) => {
            this.collection.doc(id).set({...item, createdAt: time}).then(ref => {
                const newItem = {
                    id: item.id,
                    /* workaround until spread works with generic types */
                    ...(item as any)
                };
                resolve(newItem);
            });
        });
        return promise;
    } 
    
    
    
    update(data) {
  
        console.log(`[BaseService] updating item ${data.id}`);
        console.log(data);
        let time = new Date();
        const promise = new Promise((resolve, reject) => {
        const docRef = this.collection
            .doc(data.id)
            .set({...data, updatedAt:time})
            .then(() => {
                resolve({
                    ...(data as any)
                });
            });
        });
        return promise;
    }

    public updateValues(id,data){
        const promise = new Promise((resolve, reject) => {
            return this.collection.doc(id).update(data).then((resp) => {
                resolve({
                    ...(resp as any)
                });
            });
        })
        return promise;
    }
    
    delete(id: string) {
        console.log(`[BaseService] deleting item ${id}`);    
        const docRef = this.collection.doc(id);
        return docRef.delete();
    }
  }