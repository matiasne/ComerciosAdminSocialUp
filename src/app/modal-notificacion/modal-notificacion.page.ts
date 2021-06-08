import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-notificacion',
  templateUrl: './modal-notificacion.page.html',
  styleUrls: ['./modal-notificacion.page.scss'],
})
export class ModalNotificacionPage implements OnInit {

  @Input() iconOk = false;
  @Input() iconTrash =false;


  @Input() titulo ="";
  @Input() subtitulo="";


  constructor() { }

  ngOnInit() {
  }

}
