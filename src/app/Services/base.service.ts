import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

@Injectable({
  providedIn: 'root'
})
export class BaseService {



    private collection: AngularFirestoreCollection;

    public path:string ="";
    
    constructor(
        protected afs: AngularFirestore
        ) {
      
    }
  
    public setPath(path){
      this.path = path;
      this.collection = this.afs.collection(path);
    }
  
    get(identifier: string) {
      console.log('[BaseService] get: ${identifier}');
  
      return this.collection
          .doc(identifier)
          .snapshotChanges()
          .pipe(
              map(doc => {
                  if (doc.payload.exists) {
              /* workaround until spread works with generic types */
                      const data = doc.payload.data() as any;
                      const id = doc.payload.id;
                      data.fromCache = doc.payload.metadata.fromCache;
                      return { id, ...data };
                  }
              })
          );
    }
  
    getRef(id){
      return this.collection.doc(id).ref;
    }
  
  
    list() {
        console.log('[BaseService] list');    
  
        return this.collection
            .snapshotChanges()
            .pipe(
                map(changes => {
                    return changes.map(a => {
                        const data = a.payload.doc.data();
                        data.id = a.payload.doc.id;
                        data.fromCache = a.payload.doc.metadata.fromCache;
                        if(data.createdAt instanceof String || Number){
                            data.createdAt = new Date(Number(data.createdAt))
                        }
                        else{
                            data.createdAt = data.createdAt.toDate();
                        }
                           
                        return data;
                    });
                })
            );          
      }     
  
    add(item) {  
        delete item.id;  
        console.log('[BaseService] adding item'+this.path);
        console.log(item);
        const promise = new Promise((resolve, reject) => {
            this.collection.add({...item, createdAt: firebase.firestore.FieldValue.serverTimestamp()}).then(ref => {
                const newItem = {
                    id: ref.id,
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
        const promise = new Promise((resolve, reject) => {
        const docRef = this.collection
            .doc(data.id)
            .set(data)
            .then(() => {
                resolve({
                    ...(data as any)
                });
            });
        });
        return promise;
    }
    
    delete(id: string) {
        console.log(`[BaseService] deleting item ${id}`);
    
        const docRef = this.collection.doc(id);
        return docRef.delete();
    }
  }