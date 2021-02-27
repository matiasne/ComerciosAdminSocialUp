import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Comentario } from '../models/comentario';
import { AuthenticationService } from '../Services/authentication.service';
import { ComentariosService } from '../Services/comentarios.service';
import { UsuariosService } from '../Services/usuarios.service';

@Component({
  selector: 'app-form-comentario',
  templateUrl: './form-comentario.page.html',
  styleUrls: ['./form-comentario.page.scss'],
})
export class FormComentarioPage implements OnInit {

  public comentableId ="";
  public comentableTipo ="";
  public titulo="Agregar Comentario";

  public comentario:Comentario;

  constructor(
    private navParams:NavParams,
    private modalCtrl:ModalController,
    private comentarioService:ComentariosService,
    private authService:AuthenticationService
  ) { 
    this.titulo = this.navParams.get('comentableTitulo'); 
    this.comentario = new Comentario();
    this.comentario.senderId = this.authService.getUID();
    this.comentario.senderEmail = this.authService.getEmail();
    this.comentableId = this.navParams.get('comentableId');
    this.comentableTipo = this.navParams.get('comentableTipo');

    this.comentarioService.setearPath(this.comentableTipo,this.comentableId);
  }

  ngOnInit() {
  }

  cancelar(){
    this.modalCtrl.dismiss();
  }

  guardar(){

    this.comentarioService.add(this.comentario).then(data=>{
      console.log(data);
      this.modalCtrl.dismiss(this.comentario);
    })
    
  }

}
