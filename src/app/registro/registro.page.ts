import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../Services/authentication.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastService } from '../Services/toast.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  datosForm: FormGroup;
  public submitted = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService:AuthenticationService,
    public alertController: AlertController,
    private toastServices:ToastService,
    private router: Router,
  ) { 

    this.datosForm = this.formBuilder.group({     
      email: ['', Validators.required],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
      accepted:['true']
    });

  }

  ngOnInit() {
  }

  registrar(){

    this.submitted = true;
    // stop here if form is invalid
    if (this.datosForm.invalid) {
        this.toastServices.alert('Por favor completar todos los campos marcados con * antes de continuar',"");
        return;
    }   
    
    this.authService.signup(this.datosForm.controls.email.value,this.datosForm.controls.password.value);    
  }

  get f() { return this.datosForm.controls; }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
