import { Component, OnInit } from '@angular/core';
import { RolesService } from '../Services/roles.service';
import { UsuariosService } from '../Services/usuarios.service';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-empleado',
  templateUrl: './select-empleado.page.html',
  styleUrls: ['./select-empleado.page.scss'],
})
export class SelectEmpleadoPage implements OnInit {

  items:any = [];
  public itemsAll:any = [];
  public subsItems: Subscription;
  public palabraFiltro = "";

  constructor(
    public rolesService:RolesService,
    public usuariosService:UsuariosService,
    public modalCtrl: ModalController,
    public router:Router
  ) { }

  ngOnInit() {

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

  seleccionar(item){
    this.modalCtrl.dismiss({
      'item': item
    });
  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

  invitar(){
    this.router.navigate(['form-invitacion']);
    this.modalCtrl.dismiss();
  }

}

