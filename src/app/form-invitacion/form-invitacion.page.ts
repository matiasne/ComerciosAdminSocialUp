import { Component, OnInit } from '@angular/core';
import { RolesService } from '../Services/roles.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { InvitacionesService } from '../Services/invitaciones.service';
import { AuthenticationService } from '../Services/authentication.service';
import { ComerciosService } from '../Services/comercios.service';
import { NavController, ModalController, NavParams } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Invitacion } from '../models/invitacion';
import { AngularFirestore } from 'angularfire2/firestore';
import { Rol } from '../models/rol';
import { ToastService } from '../Services/toast.service';
import { Comercio } from '../Models/comercio';

@Component({
  selector: 'app-form-invitacion',
  templateUrl: './form-invitacion.page.html',
  styleUrls: ['./form-invitacion.page.scss'],
})
export class FormInvitacionPage implements OnInit {

  datosForm: FormGroup;
  submitted = false;
  comercio:any = "";
  public invitacion:Invitacion;
  public rol="";
  public email="";
  public roles=[
    "Cocinero",
    "Mesero",
    "Cajero"
  ]
  
  public rolesTipos = [];
  constructor(
    private invitacionService:InvitacionesService,
    private rolesService:RolesService,
    private formBuilder: FormBuilder,
    private authService:AuthenticationService,
    private comercioService:ComerciosService,
    private navCtrl:NavController,
    private route:ActivatedRoute,
    private modalCtrl:ModalController,
    private navParams:NavParams,
    private firestore: AngularFirestore,
    private toastServices:ToastService,
  ) { 


    this.rol = this.navParams.get('rol');

    var user = this.authService.getActualUser();   

    this.datosForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
  }


  ngOnInit() {
  }

  guardar(){

    if(this.email == ""){
      this.toastServices.mensaje("Por favor ingrese un mail antes de continuar","");
      return;
    }

    if(this.rol == ""){
      this.toastServices.mensaje("Por favor ingrese un rol antes de continuar","");
      return;
    }
  
    let rol:Rol = new Rol(); 
    rol.id = this.firestore.createId();    
    rol.userEmail = this.email;
    rol.rol = this.rol;
    rol.estado = "pendiente";
    rol.comercioId =this.comercioService.getSelectedCommerceValue().id;
//    rol.comercioRef = this.comercioService.getRef(this.comercioService.getSelectedCommerceValue().id);
    this.rolesService.create(rol);
    
    this.invitacionService.enviarInvitacion(this.email.trim(),this.rol); 

    this.modalCtrl.dismiss();
  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

  cambioRol(){
    this.rol
  }

}
