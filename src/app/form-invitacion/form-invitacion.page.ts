import { Component, OnInit } from '@angular/core';
import { RolesService } from '../Services/roles.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../Services/authentication.service';
import { ComerciosService } from '../Services/comercios.service';
import { NavController, ModalController, NavParams } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Invitacion } from '../models/invitacion';
import { AngularFirestore } from 'angularfire2/firestore';
import { Rol } from '../models/rol';
import { ToastService } from '../Services/toast.service';
import { Comercio } from '../models/comercio';

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
  
    let nuevoRol:Rol = new Rol(); 
    nuevoRol.id = this.firestore.createId();    
    nuevoRol.userEmail = this.email;
    nuevoRol.adminEmail = this.authService.getEmail();
    nuevoRol.comercioNombre = this.comercioService.getSelectedCommerceValue().nombre;
    nuevoRol.rol = this.rol;
    nuevoRol.estado = "pendiente";
    nuevoRol.comercioId =this.comercioService.getSelectedCommerceValue().id;
//    rol.comercioRef = this.comercioService.getRef(this.comercioService.getSelectedCommerceValue().id);
    this.rolesService.create(nuevoRol);
    
    this.modalCtrl.dismiss();
  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

  cambioRol(){
    this.rol
  }

}
