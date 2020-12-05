import { Component, OnInit } from '@angular/core';
import { RolesService } from '../Services/roles.service';
import { UsuariosService } from '../Services/usuarios.service';
import { Subscription } from 'rxjs';
import { ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormInvitacionPage } from '../form-invitacion/form-invitacion.page';
import { User } from 'firebase';
import { AuthenticationService } from '../Services/authentication.service';

@Component({
  selector: 'app-list-empleados',
  templateUrl: './list-empleados.page.html',
  styleUrls: ['./list-empleados.page.scss'],
})
export class ListEmpleadosPage implements OnInit {

  items:any = [];
  public itemsAll:any = [];
  public subsItems: Subscription;
  public palabraFiltro = "";
  public user:User;

  constructor(
    public authService:AuthenticationService,
    public rolesService:RolesService,
    public usuariosService:UsuariosService,
    public modalCtrl: ModalController,
    public router:Router,
  ) { }

  ngOnInit() {

    this.user = this.authService.getActualUser();

   var rolSub = this.rolesService.getAllRolesbyComercio().subscribe(snapshot =>{       
      
      snapshot.forEach(snap =>{
        var rol:any = snap.payload.doc.data();
        rol.id = snap.payload.doc.id;
        console.log(rol);    
        this.itemsAll.push(rol);      

      });
      this.buscar();
      rolSub.unsubscribe();
    });

  }

  buscar(){
    if(this.palabraFiltro != ""){
      this.items = [];
      this.itemsAll.forEach(item => {
        if(item.userEmail.toLowerCase().includes(this.palabraFiltro.toLowerCase())){
          this.items.push(item);
          return;
        }

        if(item.rol.toLowerCase().includes(this.palabraFiltro.toLowerCase())){
          this.items.push(item);
          return;
        }         

      });     
    }
    else{
      this.items = this.itemsAll;
    }
  }

  

  

  async invitar(){
   

  
      const modal = await this.modalCtrl.create({
        component: FormInvitacionPage,
        componentProps: {
          rol:"owner"      
        }
      });
      modal.onDidDismiss()
      .then((retorno) => {
        if(retorno.data){     
          this.ngOnInit();
  
        }        
      });
      return await modal.present();
  }

  

  desvincular(item){

    //Acá segun el rol debo elimina el rol de base de datos y además buscar en el array correspondiente
    //rolComandatarios
    //etc...

  }


}
