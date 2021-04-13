import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../Services/authentication.service';
import { AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public email:string;
  public password:string;

  @ViewChild('passwordEyeRegister') passwordEye;
  @ViewChild('passwordEyeConfirmation') passwordEyeConfirm;

  passwordTypeInput1  =  'password';
  passwordTypeInput2  =  'password';
  // Variable para cambiar dinamicamente el tipo de Input que por defecto sera 'password'
  iconpassword1  =  'eye-off';
  iconpassword2  =  'eye-off';

  public devWidth

  constructor(
    private authService:AuthenticationService,
    public alertController: AlertController,
    public router:Router,
    public platform:Platform
  ) { 
    this.devWidth = this.platform.width();
  }

  ngOnInit() {
  }

  login(){
    this.authService.login(this.email.trim(),this.password.trim()); 
    
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  public googleLogin(){
    this.authService.googleSignin();
  }

  togglePasswordMode() {
    this.passwordTypeInput1  =  this.passwordTypeInput1  ===  'text'  ?  'password'  :  'text';
    this.iconpassword1  =  this.iconpassword1  ===  'eye-off'  ?  'eye'  :  'eye-off';
    this.passwordEye.el.setFocus();
  }


}
