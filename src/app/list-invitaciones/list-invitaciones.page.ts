import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { ComerciosService } from '../Services/comercios.service';
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
    private authService:AuthenticationService,
    private rolesServices:RolesService,
    private firestore: AngularFirestore,
    private comercioService:ComerciosService,
    private rolesService:RolesService 
  ) { }

  ngOnInit() {

    
    this.rolesService.getAllRolesbyEmail(this.authService.getActualUser().email).subscribe(roles =>{    
      this.items =[]    
      roles.forEach(rol =>{           
        console.log(rol)
          if(rol.estado == "pendiente")
            this.items.push(rol);        
      })  
      this.buscando = false 
    });   
    
  }

  ionViewDidEnter(){
 
  }

  ionViewDidLeave(){
    this.subsItems.unsubscribe(); 
  }
 

  eliminarInvitacion(item){    
    item.estado = "rechazada"; 
    this.rolesService.setPath('comercios/'+item.comercioId+'/roles')       
    this.rolesService.update(item).then(data=>{
      
    })       
  }

  aceptarInvitacion(item){
    item.estado = "aceptada";    
    this.rolesService.setPath('comercios/'+item.comercioId+'/roles')       
    this.rolesService.update(item).then(data=>{
      
    })       
  }
    

}
