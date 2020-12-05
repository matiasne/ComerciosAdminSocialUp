import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-details-whatsapp',
  templateUrl: './details-whatsapp.page.html',
  styleUrls: ['./details-whatsapp.page.scss'],
})
export class DetailsWhatsappPage implements OnInit {

  public link="";

  public title = 'app';
  public elementType = 'url';
  public value = 'Techiediaries';

  constructor() { }

  ngOnInit() {

    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');

    this.value = "https://socialup.web.app/c/"+comercio_seleccionadoId;

    
  }

}
