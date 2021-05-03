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
  public buscando = true;
  
  constructor(
    public modalController: ModalController,
    public loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    public invitacionesServices:InvitacionesService,
    private authService:AuthenticationService,
    private rolesServices:RolesService,
    private firestore: AngularFirestore,
    private comercioService:ComerciosService,
    private rolesService:RolesService
  ) { }

  ngOnInit() {
    
    this.subsItems = this.invitacionesServices.getAll(this.authService.getUID()).subscribe((snapshot) => {
      this.buscando = false;
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
  
  
      
    });
    
  }

  ionViewDidEnter(){
 
  }

  ionViewDidLeave(){
    this.subsItems.unsubscribe(); 
  }

  buscar(){

    
   
  }

  seleccionar(item){

  }

  

  

  eliminarInvitacion(item){

    var rolSub = this.rolesService.getAllRolesbyComercio(item.comercioId).subscribe(data =>{       
      
      data.forEach(rol =>{
       // var rol:any = snap.payload.doc.data();
       // rol.id = snap.payload.doc.id;
        rol.userId = this.authService.getUID();  
        
        console.log(rol); 
        
        if(rol.userEmail.trim() == item.email.trim() && rol.rol == item.rol){
          rol.estado = "rechazada";        
          this.rolesServices.update(rol);
        }
           
      });
      //this.buscar();
      rolSub.unsubscribe();
    });
    this.invitacionesServices.delete(item);
  }

  aceptarInvitacion(item){

    var rolSub = this.rolesService.getAllRolesbyComercio(item.comercioId).subscribe(data =>{       
      
      data.forEach(rol =>{
        //var rol:any = snap.payload.doc.data();
        //rol.id = snap.payload.doc.id;
        rol.userId = this.authService.getUID();
        console.log(rol);   
        console.log(item)     
        if(rol.userEmail.trim() == item.email.trim() && rol.rol == item.rol){
          rol.estado = "aceptada"; 
          console.log(rol);  
          this.rolesServices.update(rol);
        }
          

      });
      //this.buscar();
      rolSub.unsubscribe();
    });


    this.invitacionesServices.delete(item);
  }
    

}
