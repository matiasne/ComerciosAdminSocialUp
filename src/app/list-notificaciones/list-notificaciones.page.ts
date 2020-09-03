import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotifificacionesAppService } from '../Services/notifificaciones-app.service';
import { AuthenticationService } from '../Services/authentication.service';

@Component({
  selector: 'app-list-notificaciones',
  templateUrl: './list-notificaciones.page.html',
  styleUrls: ['./list-notificaciones.page.scss'],
})
export class ListNotificacionesPage implements OnInit {

  private notiSub:Subscription;
  private notificaciones = [];
  constructor(
    private notificacionesAppService:NotifificacionesAppService,
    private authService:AuthenticationService
  ) {     

  }

  ionViewDidEnter(){
    let usuario = this.authService.getActualUser();
    console.log(usuario)
    this.notiSub = this.notificacionesAppService.getAll(usuario.uid).subscribe(snapshot=>{                 
      this.notificaciones = [];
      snapshot.forEach((snap: any) => {           
          var item = snap.payload.doc.data();
          item.id = snap.payload.doc.id; 
          item.createdAt = this.toDateTime(item.createdAt.seconds);
          this.notificaciones.push(item);             
      });
      console.log(this.notificaciones);
      
    }); 
  }

  ionViewDidLeave(){
    this.notificaciones.forEach(element => {
        if(element.estado == "enviada"){
          element.estado = "leida";
          this.notificacionesAppService.update(element);
        }
    });
    this.notiSub.unsubscribe();
  }

  eliminar(item){
    this.notificacionesAppService.delete(item);
  }

  
  toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
  }

  ngOnInit() {
  }

}
