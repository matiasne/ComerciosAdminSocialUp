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

  get f() { return this.datosForm.controls; }

  ngOnInit() {
  }

  guardar(){

    this.submitted = true;
    // stop here if form is invalid

    console.log(this.datosForm.value);
    if (this.datosForm.invalid) {
      this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
      return;
    }   

    
    this.invitacionService.enviarInvitacion(this.datosForm.controls.email.value.trim(),this.rol)

   

    this.modalCtrl.dismiss(this.datosForm.controls.email.value);
  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

}
