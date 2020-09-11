import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-details-whatsapp',
  templateUrl: './details-whatsapp.page.html',
  styleUrls: ['./details-whatsapp.page.scss'],
})
export class DetailsWhatsappPage implements OnInit {

  public link="";
  constructor() { }

  ngOnInit() {

    let comercio_seleccionadoId = localStorage.getItem('comercio_seleccionadoId');

    this.link = "https://comercios-admin-socialup.web.app/details-comercio;id="+comercio_seleccionadoId+";porWhatsapp=true;comercioUnico=true";
  }

}
