import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../Services/authentication.service';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
})
export class RecuperarContrasenaPage implements OnInit {

  public email ="";
  
  constructor(
    private authFirebaseService:AuthenticationService
  ) { }

  ngOnInit() {
  }

  recuperarContrasena(){
    this.authFirebaseService.resetPassword(this.email);
  }

}
