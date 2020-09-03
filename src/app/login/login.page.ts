import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../Services/authentication.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public email:string;
  public password:string;

  constructor(
    private authService:AuthenticationService,
    public alertController: AlertController,
    public router:Router,
  ) { }

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


}
