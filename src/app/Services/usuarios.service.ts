import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Beneficio } from '../models/beneficio';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private collection:string;

  public usuarioLogueado:User
  public connectionSubject = new BehaviorSubject <any>("");
  public usuarioSubject = new BehaviorSubject <any>("");

  constructor(
    private firestore: AngularFirestore,
  ) { 
    this.collection = 'users';
    this.usuarioLogueado = new User()
  }

  public setForConnectionStatus(uid){
    this.get(uid).subscribe((data:any)=>{
      this.usuarioLogueado = data.payload.data();
      this.usuarioSubject.next(data.payload.data())
      this.connectionSubject.next(this.usuarioLogueado.state);
    })   
  }

  public getConnectionStatus():Observable<any>{
    return this.connectionSubject.asObservable();
  }

  public getUserData(){
    return this.usuarioSubject.asObservable();
  }

  public get(documentId: string) {
    return this.firestore.collection(this.collection).doc(documentId).snapshotChanges();
  }

  public getByEmail(email){
    return this.firestore.collection(this.collection, ref => ref.where('email', '==', email)).snapshotChanges();
  }

  public getAll(){
    return this.firestore.collection(this.collection).snapshotChanges();
  }

  public updateNotificaiconesWebToke(id,token){
    let param = {
      notificacionesWebToken:token
    }
    console.log("seteando token: "+id)
    this.firestore.collection(this.collection).doc(id).set(param, { merge: true });
  }

  public updateNotificaiconesCelularToke(id,token){
    let param = {
      notificacionesCelularToke:token
    }
    this.firestore.collection(this.collection).doc(id).set(param, { merge: true });
  }

  public setComecioSeleccionado(id,comercioId){
    let param = {
      comercioSeleccionadoId:comercioId
    }
    this.firestore.collection(this.collection).doc(id).set(param, { merge: true });
  }
 
  public update(user:User){
      this.firestore.collection(this.collection).doc(user.uid).update(user)
  }

}
