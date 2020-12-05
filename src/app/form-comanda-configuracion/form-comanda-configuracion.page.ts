import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComerciosService } from '../Services/comercios.service';
import { Comercio } from '../Models/comercio';
import { SelectEmpleadoPage } from '../select-empleado/select-empleado.page';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { FormInvitacionPage } from '../form-invitacion/form-invitacion.page';
import { RolesService } from '../Services/roles.service';
import { UsuariosService } from '../Services/usuarios.service';
import { Rol } from '../models/rol';
import { AngularFirestore } from 'angularfire2/firestore';
import { Invitacion } from '../models/invitacion';
import { AuthenticationService } from '../Services/authentication.service';
import { InvitacionesService } from '../Services/invitaciones.service';

@Component({
  selector: 'app-form-comanda-configuracion',
  templateUrl: './form-comanda-configuracion.page.html',
  styleUrls: ['./form-comanda-configuracion.page.scss'],
})
export class FormComandaConfiguracionPage implements OnInit {

  private subs:Subscription; 
  public comercio:Comercio;
  public comandatarios = [];

  constructor(
    
  ) {    


  }

  ionViewDidLeave(){
   // this.subs.unsubscribe();
  }

  ngOnInit() {
  }


  

}
