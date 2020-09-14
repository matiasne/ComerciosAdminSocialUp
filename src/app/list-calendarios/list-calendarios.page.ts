import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../Services/servicios.service';
import { CalendariosService } from '../Services/calendarios.service';

@Component({
  selector: 'app-list-calendarios',
  templateUrl: './list-calendarios.page.html',
  styleUrls: ['./list-calendarios.page.scss'],
})
export class ListCalendariosPage implements OnInit {

  public calendarios = [];
  constructor(
    private serivicosServices:ServiciosService,
    private calendarioService:CalendariosService
  ) { }

  ngOnInit() {

    this.serivicosServices.list().subscribe((servicios:any)=>{
      servicios.forEach(servicio => {
        this.calendarioService.setPathIds(servicio.id)
        this.calendarioService.list().subscribe(calendarios =>{
          calendarios.forEach(cal =>{
            this.calendarios.push(cal);
          });
        });
      });     
    });

  }

}
