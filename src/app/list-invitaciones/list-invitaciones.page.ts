import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { ComerciosService } from '../Services/comercios.service';
import { InvitacionesService } from '../Services/invitaciones.service';
import { AuthenticationService } from '../Services/authentication.service';
import { Rol } from '../models/rol';
import { RolesService } from '../Services/roles.service';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-list-invitaciones',
  templateUrl: './list-invitaciones.page.html',
  styleUrls: ['./list-invitaciones.page.scss'],
})
export class ListInvitacionesPage implements OnInit {

  
  items:any = [];
  public subsItems: Subscription;
  public palabraFiltro = "";
  public ultimoItem = "";
  public loadingActive = false;
  
  constructor(
    public modalController: ModalController,
    public loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    public invitacionesServices:InvitacionesService,
    private authService:AuthenticationService,
    private rolesServices:RolesService,
    private firestore: AngularFirestore,
    private comercioService:ComerciosService
  ) { }

  ngOnInit() {

    
    
  }

  ionViewDidEnter(){

    this.ultimoItem = "";
    if(this.route.snapshot.params.filtro)
      this.palabraFiltro = this.route.snapshot.params.filtro;

    this.buscar();
  }

  ionViewDidLeave(){
    this.subsItems.unsubscribe(); 
  }

  buscar(){

    
    this.ultimoItem = "";  
    this.presentLoading();
    var user = this.authService.getActualUser();
    this.subsItems = this.invitacionesServices.getByEmail(user.email).subscribe((snapshot) => {
     
      this.items = [];  
      console.log(snapshot)
      snapshot.forEach((snap: any) => {         
          var item = snap.payload.doc.data();
          item.id = snap.payload.doc.id;         
          this.items.push(item);                 
      });
      console.log(this.items); 
      
      if(this.items.length > 0)
        this.ultimoItem = this.items[this.items.length - 1].name;
  
      this.hideLoading();   
  
      
    });
  }

  seleccionar(item){

  }

  showMore(event){
    console.log(this.ultimoItem);
    var user = this.authService.getActualUser();
    this.subsItems = this.invitacionesServices.getByEmail(user.email).subscribe((snapshot) => {
    
      if(snapshot.length < 4){
        event.target.complete();
      }
      
      console.log(snapshot)
      snapshot.forEach((snap: any) => {         
          var item = snap.payload.doc.data();
          item.id = snap.payload.doc.id;         
          this.items.push(item);   
          this.ultimoItem =  item.createdAt;            
      });
      console.log(this.items); 

      
      event.target.complete();
    
        
    });
  }


  

  async presentLoading() {
    this.loadingActive = true;
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();
  }


  hideLoading(){
    if(this.loadingActive){
      this.loadingController.dismiss();
      this.loadingActive = false;
    }
  }

  eliminarInvitacion(item){
    this.invitacionesServices.delete(item);
  }

  aceptarInvitacion(item){

    var rol:Rol = new Rol();
    rol.id = this.firestore.createId();
    rol.comercioRef = this.comercioService.getRef(item.comercioId);
    rol.user_email = item.email;
    rol.rol = item.rol;
    rol.estado = "aceptada";
    this.rolesServices.create(rol);

    if(item.rol == "comandatario"){
      let comercio = this.comercioService.comercio;
      comercio.rolComandatarios.push(rol.id);
      this.comercioService.update(comercio);
    }

    if(item.rol == "cadete"){
      let comercio = this.comercioService.comercio;
      comercio.rolCadetes.push(rol.id);
      this.comercioService.update(comercio);
    }

    if(item.rol == "encargado"){
      let comercio = this.comercioService.comercio;
      comercio.rolEncargados.push(rol.id);
      this.comercioService.update(comercio);
    }

    this.invitacionesServices.delete(item);
  }

}
