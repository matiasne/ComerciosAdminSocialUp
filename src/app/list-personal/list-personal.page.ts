import { Component, OnInit } from '@angular/core';
import { RolesService } from '../Services/roles.service';
import { UsuariosService } from '../Services/usuarios.service';
import { Subscription } from 'rxjs';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormInvitacionPage } from '../form-invitacion/form-invitacion.page';
import { User } from 'firebase';
import { AuthenticationService } from '../Services/authentication.service';

@Component({
  selector: 'app-list-personal',
  templateUrl: './list-personal.page.html',
  styleUrls: ['./list-personal.page.scss'],
})
export class ListPersonalPage implements OnInit {

  items:any = [];
  public itemsAll:any = [];
  public rolSub: Subscription;
  public palabraFiltro = "";
  public user:User;

  constructor(
    public authService:AuthenticationService,
    public rolesService:RolesService,
    public usuariosService:UsuariosService,
    public modalCtrl: ModalController,
    public router:Router,
    public alertController:AlertController
  ) { }

  ngOnInit() {
   
    this.user = this.authService.getActualUser();

    this.rolSub = this.rolesService.getAllRolesbyComercio().subscribe(snapshot =>{
      this.itemsAll = [];
      snapshot.forEach(snap =>{
        var rol:any = snap.payload.doc.data();
        rol.id = snap.payload.doc.id;
        this.itemsAll.push(rol);
      });
      this.buscar();
    });

    /*var rolSub = this.rolesService.getAllRolesbyComercio().subscribe(snapshot =>{       
      
      snapshot.forEach(snap =>{
        
        var rol:any = snap.payload.doc.data();
        rol.id = snap.payload.doc.id;
        
        var usub = this.usuariosService.getByEmail(rol.user_email).subscribe(snapshot2=>{

          console.log(snapshot2);
          snapshot2.forEach(snap2 =>{
           
            var item:any = snap2.payload.doc.data();
            item.id = rol.id;   
            item.rol = rol;
            item.estado = rol.estado;
            console.log(item);
            this.itemsAll.push(item);

          });
          
          usub.unsubscribe();
        });

      });
      this.buscar();
      rolSub.unsubscribe();
    });*/

  }

  ionViewDidLeave(){
    this.rolSub.unsubscribe();
  }

  buscar(){
    if(this.palabraFiltro != ""){
      this.items = [];
      this.itemsAll.forEach(item => {
        if(item.nombre.toLowerCase().includes(this.palabraFiltro.toLowerCase())){
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

  async desvincular(item){
    

    const alert = await this.alertController.create({
      header: 'Está seguro que desea desvincular el empleado',
      message: 'Se perderán los registros del mismo',
      buttons: [
        {
          text: 'No',
          handler: (blah) => {
            
          }
        }, {
          text: 'Si',
          handler: () => {  
            console.log("!!!!!")
            this.rolesService.delete(item.id).then(data=>{
              this.ngOnInit();
            });
          }
        }
      ]
    });
    await alert.present();    
  }
 

}