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
  public notificaciones = [];
  public buscando = true;

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
      this.buscando = false;
      snapshot.forEach((snap: any) => {           
          var item = snap.payload.doc.data();
          item.id = snap.payload.doc.id; 
          this.notificaciones.push(item);             
      });
      console.log(this.notificaciones);
      
    }); 
  }

  ionViewDidLeave(){
    this.notificaciones.forEach(element => {
        if(element.estado == "pendiente"){
          element.estado = "leida";
          this.notificacionesAppService.update(element);
        }
    });
    this.notiSub.unsubscribe();
  }

  eliminar(item){
    this.notificacionesAppService.delete(item);
  }

  

  ngOnInit() {
  }

}
